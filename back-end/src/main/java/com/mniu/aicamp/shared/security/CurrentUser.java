package com.mniu.aicamp.shared.security;


public record CurrentUser(Long id, String email, String role) {
    /** 默认角色：普通用户 */
    public static final String ROLE_USER = "USER";
    /** 管理员角色 */
    public static final String ROLE_ADMIN = "ADMIN";

    public boolean isAdmin() {
        return ROLE_ADMIN.equals(role);
    }
}
