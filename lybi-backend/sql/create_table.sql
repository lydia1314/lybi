-- 数据库初始化
-- @author <a href="https://github.com/liyupi">程序员鱼皮</a>
-- @from <a href="https://yupi.icu">编程导航知识星球</a>

-- 创建库
CREATE DATABASE IF NOT EXISTS lybi;

-- 切换库
USE lybi;

-- 用户表
CREATE TABLE IF NOT EXISTS user
(
    id           BIGINT AUTO_INCREMENT COMMENT 'id' PRIMARY KEY,
    userAccount  VARCHAR(256)                           NOT NULL COMMENT '账号',
    userPassword VARCHAR(512)                           NOT NULL COMMENT '密码',
    userName     VARCHAR(256)                           NULL COMMENT '用户昵称',
    userAvatar   VARCHAR(1024)                          NULL COMMENT '用户头像',
    userRole     VARCHAR(256) DEFAULT 'user'            NOT NULL COMMENT '用户角色：user/admin',
    createTime   DATETIME     DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    updateTime   DATETIME     DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    isDelete     TINYINT      DEFAULT 0                 NOT NULL COMMENT '是否删除',
    INDEX idx_userAccount (userAccount)
) COMMENT '用户' COLLATE = utf8mb4_unicode_ci;

-- 图表信息表
CREATE TABLE IF NOT EXISTS chart
(
    id         BIGINT AUTO_INCREMENT COMMENT 'id' PRIMARY KEY,
    userId     BIGINT                               NOT NULL COMMENT '关联的用户ID',
    goal       TEXT                                 NULL COMMENT '分析目标',
    `name`     VARCHAR(128)                         NULL COMMENT '图标名称',
    chartData  TEXT                                 NULL COMMENT '图表数据',
    chartType  VARCHAR(128)                         NULL COMMENT '图表类型',
    genChart   TEXT                                 NULL COMMENT '生成的图表数据',
    genResult  TEXT                                 NULL COMMENT '生成的图表分析结论',
    createTime DATETIME DEFAULT CURRENT_TIMESTAMP   NOT NULL COMMENT '创建时间',
    updateTime DATETIME DEFAULT CURRENT_TIMESTAMP   NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    isDelete   TINYINT  DEFAULT 0                   NOT NULL COMMENT '是否删除',
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
    INDEX idx_userId (userId)
) COMMENT '图表信息表' COLLATE = utf8mb4_unicode_ci;

-- 帖子表
create table if not exists post
(
    id         bigint auto_increment comment 'id' primary key,
    title      varchar(512)                       null comment '标题',
    content    text                               null comment '内容',
    tags       varchar(1024)                      null comment '标签列表（json 数组）',
    thumbNum   int      default 0                 not null comment '点赞数',
    favourNum  int      default 0                 not null comment '收藏数',
    userId     bigint                             not null comment '创建用户 id',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                 not null comment '是否删除',
    index idx_userId (userId)
) comment '帖子' collate = utf8mb4_unicode_ci;