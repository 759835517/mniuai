#!/bin/bash
# E2E 测试统一运行器
# 用法: ./run-all.sh [test-name]
# 示例:
#   ./run-all.sh           # 运行全部测试
#   ./run-all.sh auth      # 只运行认证测试
#   ./run-all.sh video     # 只运行视频测试

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPORT_DIR="$SCRIPT_DIR/reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

mkdir -p "$REPORT_DIR"

echo "========================================"
echo "  E2E 测试套件"
echo "  时间: $(date)"
echo "  API: ${API_URL:-http://localhost:8080}"
echo "  Web: ${BASE_URL:-http://localhost:3000}"
echo "========================================"

TOTAL_PASS=0
TOTAL_FAIL=0
RESULTS=""

run_test() {
    local name=$1
    local file=$2
    echo ""
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}  运行: $name${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    local output_file="$REPORT_DIR/${name}_${TIMESTAMP}.log"

    if node "$file" > "$output_file" 2>&1; then
        local pass_count=$(grep -c "✅" "$output_file" || true)
        echo -e "${GREEN}  ✅ $name 通过 ($pass_count 项)${NC}"
        TOTAL_PASS=$((TOTAL_PASS + pass_count))
        RESULTS="$RESULTS\n✅ $name: PASS ($pass_count 项)"
    else
        local fail_count=$(grep -c "❌" "$output_file" || true)
        echo -e "${RED}  ❌ $name 失败 ($fail_count 项)${NC}"
        TOTAL_FAIL=$((TOTAL_FAIL + fail_count))
        RESULTS="$RESULTS\n❌ $name: FAIL ($fail_count 项)"
        cat "$output_file"
    fi
}

# 根据参数选择测试
case "${1:-all}" in
    auth)
        run_test "auth" "$SCRIPT_DIR/auth.spec.js"
        ;;
    video)
        run_test "video-hls" "$SCRIPT_DIR/video-hls.spec.js"
        ;;
    sandbox)
        run_test "sandbox" "$SCRIPT_DIR/sandbox.spec.js"
        ;;
    coach)
        run_test "coach-ai" "$SCRIPT_DIR/coach-ai.spec.js"
        ;;
    ui)
        run_test "ui-flow" "$SCRIPT_DIR/ui-flow.spec.js"
        ;;
    all)
        run_test "auth" "$SCRIPT_DIR/auth.spec.js"
        run_test "video-hls" "$SCRIPT_DIR/video-hls.spec.js"
        run_test "sandbox" "$SCRIPT_DIR/sandbox.spec.js"
        run_test "coach-ai" "$SCRIPT_DIR/coach-ai.spec.js"
        run_test "ui-flow" "$SCRIPT_DIR/ui-flow.spec.js"
        ;;
    *)
        echo "未知测试名称: $1"
        echo "可用: auth, video, sandbox, coach, ui, all"
        exit 1
        ;;
esac

# 生成汇总报告
echo ""
echo "========================================"
echo "  E2E 测试汇总报告"
echo "========================================"
echo -e "$RESULTS"
echo ""
echo "----------------------------------------"
echo -e "  总计: ${GREEN}$TOTAL_PASS 通过${NC}, ${RED}$TOTAL_FAIL 失败${NC}"
echo "  报告目录: $REPORT_DIR"
echo "========================================"

# 写入汇总文件
cat > "$REPORT_DIR/summary_${TIMESTAMP}.txt" << EOF
E2E 测试汇总报告
时间: $(date)
API: ${API_URL:-http://localhost:8080}
Web: ${BASE_URL:-http://localhost:3000}

$RESULTS

总计: $TOTAL_PASS 通过, $TOTAL_FAIL 失败
EOF

[ $TOTAL_FAIL -eq 0 ]
