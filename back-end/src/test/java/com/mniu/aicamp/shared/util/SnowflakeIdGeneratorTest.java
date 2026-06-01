package com.mniu.aicamp.shared.util;

import org.junit.jupiter.api.Test;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.LongSupplier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SnowflakeIdGeneratorTest {

    @Test
    void nextIdIncrementsSequenceWithinSameMillisecond() {
        SnowflakeIdGenerator generator = new SnowflakeIdGenerator(2, () -> 1_800_000_000_000L);

        long first = generator.nextId();
        long second = generator.nextId();

        assertThat(second).isEqualTo(first + 1);
    }

    @Test
    void nextIdRejectsClockMovingBackwards() {
        long[] timestamps = {1_800_000_000_010L, 1_800_000_000_009L};
        AtomicInteger index = new AtomicInteger();
        SnowflakeIdGenerator generator = new SnowflakeIdGenerator(1,
                () -> timestamps[Math.min(index.getAndIncrement(), timestamps.length - 1)]);

        generator.nextId();

        assertThatThrownBy(generator::nextId)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Clock moved backwards");
    }

    @Test
    void nextIdWaitsForNextMillisecondWhenSequenceOverflows() {
        long base = 1_800_000_000_100L;
        AtomicInteger calls = new AtomicInteger();
        LongSupplier clock = () -> calls.getAndIncrement() <= 4096 ? base : base + 1;
        SnowflakeIdGenerator generator = new SnowflakeIdGenerator(1, clock);

        long previous = generator.nextId();
        for (int i = 0; i < 4096; i++) {
            long next = generator.nextId();
            assertThat(next).isGreaterThan(previous);
            previous = next;
        }
    }

    @Test
    void constructorRejectsWorkerIdOutsideSupportedRange() {
        assertThatThrownBy(() -> new SnowflakeIdGenerator(1024, System::currentTimeMillis))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("SNOWFLAKE_WORKER_ID");
    }
}
