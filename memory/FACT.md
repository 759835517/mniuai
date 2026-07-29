# Back-end Module Structure (D:\IdeaProjects\mniuai\back-end)

## Module Layout
- Base package: `com.mniu.aicamp`
- 10 modules: `auth / coach / growth / landing / notification / project / review / roadmap / shared / user`
- Each module: `api / application / domain / infrastructure` (some have `infrastructure/{converter,mapper,po}`)

## Typical CRUD Pattern (roadmap)
- **Controller**: `@RestController @RequestMapping("/api/v1/roadmaps")`, `@Valid @RequestBody`, `@PathVariable`, `CurrentUsers.require().id()`, returns `ApiResponse<T>` / `PageResponse<T>`
- **Service**: `@Service`, `@Transactional` on writes, returns `record` types, MyBatis-Plus `Wrappers.lambdaQuery/lambdaUpdate`
- **Mapper**: `@Mapper interface XxxMapper extends BaseMapper<XxxPO>`
- **PO**: `@Data @TableName("xxx")`, `@TableId(type=IdType.INPUT) Long id`, camelCase auto-mapped
- **Record**: `public record Roadmap(@JsonSerialize(using=ToStringSerializer.class) Long id, ...)`

## Security
- `CurrentUser` = `record(Long id, String email)` — **NO role field**
- `CurrentUsers.require()` gets user from SecurityContextHolder
- `SecurityConfig`: Bearer token, only `/api/v1/auth/**`, `/api/v1/landing/**`, actuator, swagger are public; rest `authenticated()`
- **No ADMIN role, no @PreAuthorize, no hasRole — login-only auth**

## DB Migrations
- `src/main/resources/db/migration/V{N}__{description}.sql`
- V1 init schema, V2 comments, V3 UUID→snowflake bigint
- Flyway enabled in application.yml (`baseline-on-migrate: true`)
- MyBatis-Plus `id-type: INPUT` + SnowflakeIdGenerator, logic-delete field `deleted`
