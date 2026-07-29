package com.mniu.aicamp.public_.application;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 官网联系表单请求
 */
public record ContactRequest(@NotBlank(message = "姓名不能为空")
                             @Size(max = 50, message = "姓名长度不能超过50")
                             String name,

                             @NotBlank(message = "邮箱不能为空")
                             @Email(message = "邮箱格式不正确")
                             String email,

                             @NotBlank(message = "咨询类型不能为空")
                             String type,

                             @NotBlank(message = "消息不能为空")
                             @Size(max = 2000, message = "消息长度不能超过2000")
                             String message) {
}
