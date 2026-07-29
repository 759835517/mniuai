package com.mniu.aicamp.rag.infrastructure.typehandler;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * 将 Java List<Double> 映射到 PostgreSQL vector 列。
 * 写入时转为 "[1.0,2.0,...]" 字面量，读取时解析 vector 字符串。
 */
@MappedTypes(List.class)
@MappedJdbcTypes(JdbcType.OTHER)
public class VectorTypeHandler extends BaseTypeHandler<List<Double>> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, List<Double> parameter, JdbcType jdbcType) throws SQLException {
        StringBuilder sb = new StringBuilder("[");
        for (int j = 0; j < parameter.size(); j++) {
            if (j > 0) sb.append(",");
            sb.append(parameter.get(j));
        }
        sb.append("]");
        // 使用 Types.OTHER 让 PostgreSQL 自动将字符串转为 vector 类型
        ps.setObject(i, sb.toString(), java.sql.Types.OTHER);
    }

    @Override
    public List<Double> getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return parseVector(rs.getString(columnName));
    }

    @Override
    public List<Double> getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return parseVector(rs.getString(columnIndex));
    }

    @Override
    public List<Double> getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return parseVector(cs.getString(columnIndex));
    }

    private List<Double> parseVector(String value) {
        if (value == null || value.isBlank()) {
            return new ArrayList<>();
        }
        // 格式: "[1.0,2.0,3.0]"
        String trimmed = value.trim();
        if (trimmed.startsWith("[")) trimmed = trimmed.substring(1);
        if (trimmed.endsWith("]")) trimmed = trimmed.substring(0, trimmed.length() - 1);
        if (trimmed.isBlank()) {
            return new ArrayList<>();
        }
        List<Double> result = new ArrayList<>();
        for (String part : trimmed.split(",")) {
            try {
                result.add(Double.parseDouble(part.trim()));
            } catch (NumberFormatException e) {
                // skip invalid
            }
        }
        return result;
    }
}
