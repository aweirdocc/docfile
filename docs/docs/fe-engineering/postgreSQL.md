# PostgreSQL 详细使用文档

## 目录

1. [PostgreSQL 简介](#postgresql-简介)
2. [安装和配置](#安装和配置)
3. [基础操作](#基础操作)
4. [数据类型](#数据类型)
5. [表操作](#表操作)
6. [数据操作](#数据操作)
7. [查询操作](#查询操作)
8. [索引](#索引)
9. [视图](#视图)
10. [存储过程和函数](#存储过程和函数)
11. [触发器](#触发器)
12. [事务处理](#事务处理)
13. [用户和权限管理](#用户和权限管理)
14. [备份和恢复](#备份和恢复)
15. [性能优化](#性能优化)
16. [高级特性](#高级特性)

## PostgreSQL 简介

PostgreSQL 是一个功能强大的开源对象关系数据库系统，具有超过35年的积极开发历史。它以可靠性、功能强大性和性能著称。

### 主要特点

- **ACID 兼容性**: 完全支持原子性、一致性、隔离性和持久性
- **多版本并发控制 (MVCC)**: 支持高并发访问
- **丰富的数据类型**: 支持数组、JSON、XML、几何类型等
- **扩展性**: 支持自定义函数、操作符和数据类型
- **全文搜索**: 内置全文搜索功能
- **国际化**: 支持多种字符编码

## 安装和配置

### Ubuntu/Debian 安装

```bash
# 更新包列表
sudo apt update

# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### CentOS/RHEL 安装

```bash
# 安装 PostgreSQL 仓库
sudo dnf install postgresql-server postgresql-contrib

# 初始化数据库
sudo postgresql-setup --initdb

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 基础配置

```bash
# 切换到 postgres 用户
sudo -i -u postgres

# 进入 PostgreSQL 命令行
psql

# 修改 postgres 用户密码
ALTER USER postgres PASSWORD '新密码';
```

### 配置文件位置

- **postgresql.conf**: 主配置文件
- **pg_hba.conf**: 客户端认证配置
- **pg_ident.conf**: 用户名映射配置

## 基础操作

### 连接数据库

```sql
-- 连接到默认数据库
psql -U username -d database_name -h hostname -p port

-- 本地连接示例
psql -U postgres -d postgres
```

### 基本命令

```sql
-- 显示所有数据库
\l

-- 连接到数据库
\c database_name

-- 显示所有表
\dt

-- 显示表结构
\d table_name

-- 退出
\q

-- 显示当前用户
SELECT current_user;

-- 显示当前数据库
SELECT current_database();
```

## 数据类型

### 数值类型

```sql
-- 整数类型
smallint        -- 2字节整数
integer         -- 4字节整数
bigint          -- 8字节整数

-- 浮点类型
real            -- 4字节浮点数
double precision -- 8字节浮点数
numeric(p,s)    -- 可变精度数字

-- 示例
CREATE TABLE numbers (
    id SERIAL PRIMARY KEY,
    small_num SMALLINT,
    normal_num INTEGER,
    big_num BIGINT,
    decimal_num NUMERIC(10,2)
);
```

### 字符类型

```sql
-- 字符类型
CHAR(n)         -- 定长字符串
VARCHAR(n)      -- 变长字符串
TEXT            -- 无限长度文本

-- 示例
CREATE TABLE text_data (
    fixed_char CHAR(10),
    var_char VARCHAR(100),
    long_text TEXT
);
```

### 日期时间类型

```sql
-- 日期时间类型
DATE            -- 日期
TIME            -- 时间
TIMESTAMP       -- 日期时间
TIMESTAMPTZ     -- 带时区的日期时间
INTERVAL        -- 时间间隔

-- 示例
CREATE TABLE time_data (
    event_date DATE,
    event_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 布尔类型

```sql
-- 布尔类型
BOOLEAN         -- true/false

-- 示例
CREATE TABLE settings (
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE
);
```

### 特殊类型

```sql
-- UUID 类型
UUID            -- 通用唯一标识符

-- JSON 类型
JSON            -- JSON 数据
JSONB           -- 二进制 JSON 数据

-- 数组类型
INTEGER[]       -- 整数数组
TEXT[]          -- 文本数组

-- 示例
CREATE TABLE special_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metadata JSONB,
    tags TEXT[],
    coordinates POINT
);
```

## 表操作

### 创建表

```sql
-- 基本表创建
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 带约束的表
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) CHECK (price > 0),
    category_id INTEGER REFERENCES categories(id),
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 修改表结构

```sql
-- 添加列
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- 删除列
ALTER TABLE users DROP COLUMN phone;

-- 修改列类型
ALTER TABLE users ALTER COLUMN username TYPE VARCHAR(100);

-- 添加约束
ALTER TABLE users ADD CONSTRAINT check_email CHECK (email LIKE '%@%.%');

-- 删除约束
ALTER TABLE users DROP CONSTRAINT check_email;

-- 重命名表
ALTER TABLE users RENAME TO app_users;

-- 重命名列
ALTER TABLE users RENAME COLUMN username TO user_name;
```

### 删除表

```sql
-- 删除表
DROP TABLE users;

-- 如果存在则删除
DROP TABLE IF EXISTS users;

-- 级联删除（删除依赖对象）
DROP TABLE users CASCADE;
```

## 数据操作

### 插入数据

```sql
-- 基本插入
INSERT INTO users (username, email, password, first_name, last_name)
VALUES ('john_doe', 'john@example.com', 'hashed_password', 'John', 'Doe');

-- 批量插入
INSERT INTO users (username, email, password) VALUES
    ('user1', 'user1@example.com', 'pass1'),
    ('user2', 'user2@example.com', 'pass2'),
    ('user3', 'user3@example.com', 'pass3');

-- 从查询结果插入
INSERT INTO archived_users (username, email)
SELECT username, email FROM users WHERE is_active = FALSE;

-- 返回插入的数据
INSERT INTO users (username, email, password)
VALUES ('new_user', 'new@example.com', 'password')
RETURNING id, created_at;
```

### 更新数据

```sql
-- 基本更新
UPDATE users 
SET email = 'newemail@example.com', updated_at = NOW()
WHERE id = 1;

-- 批量更新
UPDATE products 
SET price = price * 1.1 
WHERE category_id = 1;

-- 条件更新
UPDATE users 
SET is_active = FALSE 
WHERE last_login < NOW() - INTERVAL '1 year';

-- 返回更新的数据
UPDATE users 
SET email = 'updated@example.com'
WHERE id = 1
RETURNING *;
```

### 删除数据

```sql
-- 基本删除
DELETE FROM users WHERE id = 1;

-- 条件删除
DELETE FROM users WHERE is_active = FALSE;

-- 返回删除的数据
DELETE FROM users 
WHERE created_at < NOW() - INTERVAL '2 years'
RETURNING id, username;

-- 清空表
TRUNCATE TABLE users;
```

## 查询操作

### 基本查询

```sql
-- 查询所有数据
SELECT * FROM users;

-- 指定列查询
SELECT id, username, email FROM users;

-- 条件查询
SELECT * FROM users WHERE is_active = TRUE;

-- 排序
SELECT * FROM users ORDER BY created_at DESC;

-- 限制结果数量
SELECT * FROM users LIMIT 10 OFFSET 20;
```

### 聚合查询

```sql
-- 计数
SELECT COUNT(*) FROM users;
SELECT COUNT(DISTINCT email) FROM users;

-- 求和、平均值、最大值、最小值
SELECT 
    COUNT(*) as total_products,
    SUM(price) as total_value,
    AVG(price) as average_price,
    MAX(price) as max_price,
    MIN(price) as min_price
FROM products;

-- 分组查询
SELECT category_id, COUNT(*), AVG(price)
FROM products 
GROUP BY category_id;

-- 分组过滤
SELECT category_id, COUNT(*) as product_count
FROM products 
GROUP BY category_id
HAVING COUNT(*) > 10;
```

### 连接查询

```sql
-- 内连接
SELECT u.username, p.title
FROM users u
INNER JOIN posts p ON u.id = p.user_id;

-- 左连接
SELECT u.username, p.title
FROM users u
LEFT JOIN posts p ON u.id = p.user_id;

-- 右连接
SELECT u.username, p.title
FROM users u
RIGHT JOIN posts p ON u.id = p.user_id;

-- 全外连接
SELECT u.username, p.title
FROM users u
FULL OUTER JOIN posts p ON u.id = p.user_id;

-- 多表连接
SELECT u.username, c.name as category, p.title
FROM users u
JOIN posts p ON u.id = p.user_id
JOIN categories c ON p.category_id = c.id;
```

### 子查询

```sql
-- 标量子查询
SELECT username, 
       (SELECT COUNT(*) FROM posts WHERE user_id = users.id) as post_count
FROM users;

-- EXISTS 子查询
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM posts p WHERE p.user_id = u.id);

-- IN 子查询
SELECT * FROM products
WHERE category_id IN (SELECT id FROM categories WHERE name LIKE '%电子%');

-- ANY/ALL 子查询
SELECT * FROM products
WHERE price > ALL (SELECT price FROM products WHERE category_id = 1);
```

### 窗口函数

```sql
-- 行号
SELECT username, email, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
FROM users;

-- 排名
SELECT username, score, 
       RANK() OVER (ORDER BY score DESC) as rank,
       DENSE_RANK() OVER (ORDER BY score DESC) as dense_rank
FROM user_scores;

-- 分组窗口函数
SELECT username, department, salary,
       AVG(salary) OVER (PARTITION BY department) as dept_avg_salary
FROM employees;

-- 累计求和
SELECT date, amount,
       SUM(amount) OVER (ORDER BY date) as running_total
FROM transactions;
```

### 条件表达式

```sql
-- CASE 语句
SELECT username,
       CASE 
           WHEN score >= 90 THEN '优秀'
           WHEN score >= 80 THEN '良好'
           WHEN score >= 60 THEN '及格'
           ELSE '不及格'
       END as grade
FROM user_scores;

-- COALESCE (返回第一个非空值)
SELECT username, COALESCE(nickname, username) as display_name
FROM users;

-- NULLIF (如果两值相等返回NULL)
SELECT username, NULLIF(status, '') as status
FROM users;
```

## 索引

### 创建索引

```sql
-- 单列索引
CREATE INDEX idx_users_email ON users(email);

-- 多列索引
CREATE INDEX idx_users_name ON users(first_name, last_name);

-- 唯一索引
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- 部分索引
CREATE INDEX idx_active_users ON users(email) WHERE is_active = TRUE;

-- 表达式索引
CREATE INDEX idx_users_lower_email ON users(LOWER(email));

-- B-tree 索引（默认）
CREATE INDEX idx_users_created_at ON users USING btree(created_at);

-- Hash 索引
CREATE INDEX idx_users_id_hash ON users USING hash(id);

-- GIN 索引（适用于数组、JSON）
CREATE INDEX idx_products_tags ON products USING gin(tags);

-- GiST 索引（适用于几何数据）
CREATE INDEX idx_locations_point ON locations USING gist(coordinates);
```

### 管理索引

```sql
-- 查看表的索引
\di users

-- 重建索引
REINDEX INDEX idx_users_email;

-- 删除索引
DROP INDEX idx_users_email;

-- 查看索引使用情况
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE tablename = 'users';
```

## 视图

### 创建视图

```sql
-- 简单视图
CREATE VIEW active_users AS
SELECT id, username, email, created_at
FROM users
WHERE is_active = TRUE;

-- 复杂视图
CREATE VIEW user_post_summary AS
SELECT 
    u.id,
    u.username,
    u.email,
    COUNT(p.id) as post_count,
    MAX(p.created_at) as last_post_date
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.username, u.email;

-- 可更新视图
CREATE VIEW user_profiles AS
SELECT id, username, first_name, last_name, email
FROM users
WHERE is_active = TRUE;
```

### 管理视图

```sql
-- 修改视图
CREATE OR REPLACE VIEW active_users AS
SELECT id, username, email, created_at, last_login
FROM users
WHERE is_active = TRUE;

-- 删除视图
DROP VIEW active_users;

-- 查看视图定义
\d+ active_users
```

## 存储过程和函数

### 创建函数

```sql
-- 简单函数
CREATE OR REPLACE FUNCTION get_user_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM users);
END;
$$ LANGUAGE plpgsql;

-- 带参数的函数
CREATE OR REPLACE FUNCTION get_user_by_id(user_id INTEGER)
RETURNS TABLE(username VARCHAR, email VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT u.username, u.email 
    FROM users u 
    WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql;

-- 复杂函数
CREATE OR REPLACE FUNCTION calculate_age(birth_date DATE)
RETURNS INTEGER AS $$
DECLARE
    age INTEGER;
BEGIN
    age := EXTRACT(YEAR FROM AGE(birth_date));
    RETURN age;
END;
$$ LANGUAGE plpgsql;
```

### 存储过程

```sql
-- 创建存储过程
CREATE OR REPLACE PROCEDURE update_user_status(
    p_user_id INTEGER,
    p_status BOOLEAN
) AS $$
BEGIN
    UPDATE users 
    SET is_active = p_status, updated_at = NOW()
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with id % not found', p_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 调用存储过程
CALL update_user_status(1, FALSE);
```

### 异常处理

```sql
CREATE OR REPLACE FUNCTION safe_divide(a NUMERIC, b NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
    IF b = 0 THEN
        RAISE EXCEPTION 'Division by zero is not allowed';
    END IF;
    RETURN a / b;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error occurred: %', SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

## 触发器

### 创建触发器函数

```sql
-- 更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 审计触发器函数
CREATE OR REPLACE FUNCTION audit_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, operation, old_data, timestamp)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), NOW());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, operation, old_data, new_data, timestamp)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW), NOW());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, operation, new_data, timestamp)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW), NOW());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

### 创建触发器

```sql
-- BEFORE 触发器
CREATE TRIGGER trigger_update_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- AFTER 触发器
CREATE TRIGGER trigger_audit_users
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW
    EXECUTE FUNCTION audit_changes();

-- INSTEAD OF 触发器（用于视图）
CREATE TRIGGER trigger_view_update
    INSTEAD OF UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_view_update();
```

### 管理触发器

```sql
-- 禁用触发器
ALTER TABLE users DISABLE TRIGGER trigger_update_timestamp;

-- 启用触发器
ALTER TABLE users ENABLE TRIGGER trigger_update_timestamp;

-- 删除触发器
DROP TRIGGER trigger_update_timestamp ON users;
```

## 事务处理

### 基本事务

```sql
-- 开始事务
BEGIN;

-- 执行操作
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- 提交事务
COMMIT;

-- 或回滚事务
ROLLBACK;
```

### 保存点

```sql
BEGIN;

INSERT INTO users (username, email) VALUES ('user1', 'user1@example.com');

-- 创建保存点
SAVEPOINT sp1;

INSERT INTO users (username, email) VALUES ('user2', 'user2@example.com');

-- 回滚到保存点
ROLLBACK TO sp1;

-- 释放保存点
RELEASE sp1;

COMMIT;
```

### 事务隔离级别

```sql
-- 设置事务隔离级别
BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- 查看当前隔离级别
SHOW transaction_isolation;
```

### 锁机制

```sql
-- 表级锁
LOCK TABLE users IN ACCESS EXCLUSIVE MODE;

-- 行级锁
SELECT * FROM users WHERE id = 1 FOR UPDATE;
SELECT * FROM users WHERE id = 1 FOR SHARE;

-- 条件锁
SELECT * FROM users WHERE is_active = TRUE FOR UPDATE SKIP LOCKED;
```

## 用户和权限管理

### 创建用户和角色

```sql
-- 创建用户
CREATE USER myuser WITH PASSWORD 'mypassword';

-- 创建角色
CREATE ROLE myrole;

-- 创建带属性的用户
CREATE USER admin_user WITH 
    PASSWORD 'secure_password'
    CREATEDB
    CREATEROLE
    LOGIN;

-- 修改用户属性
ALTER USER myuser WITH SUPERUSER;
ALTER USER myuser SET search_path TO myschema, public;
```

### 权限管理

```sql
-- 数据库权限
GRANT CONNECT ON DATABASE mydb TO myuser;
GRANT CREATE ON DATABASE mydb TO myuser;
REVOKE CONNECT ON DATABASE mydb FROM myuser;

-- 模式权限
GRANT USAGE ON SCHEMA public TO myuser;
GRANT CREATE ON SCHEMA public TO myuser;

-- 表权限
GRANT SELECT ON users TO myuser;
GRANT INSERT, UPDATE ON users TO myuser;
GRANT ALL PRIVILEGES ON users TO myuser;
REVOKE DELETE ON users FROM myuser;

-- 列级权限
GRANT SELECT (username, email) ON users TO myuser;

-- 序列权限
GRANT USAGE ON SEQUENCE users_id_seq TO myuser;

-- 函数权限
GRANT EXECUTE ON FUNCTION my_function() TO myuser;
```

### 角色管理

```sql
-- 将用户加入角色
GRANT myrole TO myuser;

-- 从角色中移除用户
REVOKE myrole FROM myuser;

-- 查看用户权限
\du myuser

-- 查看表权限
\dp users

-- 查看当前用户权限
SELECT * FROM information_schema.role_table_grants 
WHERE grantee = current_user;
```

## 备份和恢复

### 使用 pg_dump 备份

```bash
# 备份单个数据库
pg_dump -U postgres -h localhost mydb > mydb_backup.sql

# 备份所有数据库
pg_dumpall -U postgres > all_databases.sql

# 备份为自定义格式
pg_dump -U postgres -Fc mydb > mydb_backup.dump

# 备份指定表
pg_dump -U postgres -t users mydb > users_backup.sql

# 仅备份数据
pg_dump -U postgres --data-only mydb > data_only.sql

# 仅备份结构
pg_dump -U postgres --schema-only mydb > schema_only.sql
```

### 使用 pg_restore 恢复

```bash
# 从 SQL 文件恢复
psql -U postgres -d mydb < mydb_backup.sql

# 从自定义格式恢复
pg_restore -U postgres -d mydb mydb_backup.dump

# 恢复特定表
pg_restore -U postgres -d mydb -t users mydb_backup.dump

# 创建数据库并恢复
pg_restore -U postgres -C -d postgres mydb_backup.dump
```

### 在线备份和PITR

```sql
-- 开始基础备份
SELECT pg_start_backup('backup_label');

-- 结束基础备份
SELECT pg_stop_backup();

-- 查看当前WAL位置
SELECT pg_current_wal_lsn();

-- 查看备份状态
SELECT * FROM pg_stat_progress_backup;
```

## 性能优化

### 查询优化

```sql
-- 查看执行计划
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- 查看详细执行计划
EXPLAIN (ANALYZE, BUFFERS) 
SELECT u.*, COUNT(p.id) 
FROM users u 
LEFT JOIN posts p ON u.id = p.user_id 
GROUP BY u.id;

-- 查看查询成本
EXPLAIN (ANALYZE, COSTS, VERBOSE) 
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

### 统计信息

```sql
-- 更新表统计信息
ANALYZE users;

-- 更新所有表统计信息
ANALYZE;

-- 查看表统计信息
SELECT * FROM pg_stat_user_tables WHERE relname = 'users';

-- 查看索引统计信息
SELECT * FROM pg_stat_user_indexes WHERE relname = 'users';
```

### 配置优化

```sql
-- 查看配置参数
SHOW shared_buffers;
SHOW work_mem;
SHOW maintenance_work_mem;

-- 设置配置参数
SET work_mem = '256MB';
SET random_page_cost = 1.1;

-- 查看慢查询
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### 连接池

```sql
-- 查看当前连接
SELECT * FROM pg_stat_activity;

-- 终止连接
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE usename = 'myuser';

-- 查看连接限制
SHOW max_connections;
```

## 高级特性

### JSON/JSONB 操作

```sql
-- 创建包含JSON的表
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    data JSONB
);

-- 插入JSON数据
INSERT INTO documents (data) VALUES 
('{"name": "John", "age": 30, "city": "New York"}'),
('{"name": "Jane", "age": 25, "skills": ["Python", "SQL", "JavaScript"]}');

-- JSON查询
SELECT data->'name' as name FROM documents;
SELECT data->>'age' as age FROM documents;
SELECT * FROM documents WHERE data->>'city' = 'New York';
SELECT * FROM documents WHERE data->'age' > '25';

-- JSON路径查询
SELECT * FROM documents WHERE data @> '{"city": "New York"}';
SELECT * FROM documents WHERE data ? 'skills';
SELECT * FROM documents WHERE data->'skills' @> '["Python"]';

-- JSON聚合
SELECT jsonb_agg(data) FROM documents;
SELECT jsonb_object_agg(id, data->'name') FROM documents;
```

### 数组操作

```sql
-- 创建包含数组的表
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title TEXT,
    tags TEXT[]
);

-- 插入数组数据
INSERT INTO posts (title, tags) VALUES 
('PostgreSQL Tutorial', ARRAY['database', 'sql', 'postgresql']),
('Python Basics', ARRAY['python', 'programming', 'basics']);

-- 数组查询
SELECT * FROM posts WHERE 'database' = ANY(tags);
SELECT * FROM posts WHERE tags @> ARRAY['python'];
SELECT * FROM posts WHERE tags && ARRAY['sql', 'database'];

-- 数组函数
SELECT array_length(tags, 1) FROM posts;
SELECT array_append(tags, 'tutorial') FROM posts;
SELECT unnest(tags) FROM posts;
```

### 全文搜索

```sql
-- 创建全文搜索表
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    search_vector tsvector
);

-- 更新搜索向量
UPDATE articles 
SET search_vector = to_tsvector('english', title || ' ' || content);

-- 创建索引
CREATE INDEX idx_articles_search ON articles USING gin(search_vector);

-- 全文搜索
SELECT * FROM articles 
WHERE search_vector @@ to_tsquery('english', 'postgresql & database');

-- 搜索排名
SELECT *, ts_rank(search_vector, query) as rank
FROM articles, to_tsquery('english', 'postgresql') query
WHERE search_vector @@ query
ORDER BY rank DESC;
```

### 窗口函数高级应用

```sql
-- 移动平均
SELECT date, price,
       AVG(price) OVER (
           ORDER BY date 
           ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) as moving_avg
FROM stock_prices;

-- 分位数
SELECT department, salary,
       PERCENT_RANK() OVER (PARTITION BY department ORDER BY salary) as percentile
FROM employees;

-- LAG/LEAD函数
SELECT date, price,
       price - LAG(price) OVER (ORDER BY date) as price_change
FROM stock_prices;
```

### 分区表

```sql
-- 创建分区表
CREATE TABLE sales (
    id SERIAL,
    sale_date DATE,
    amount DECIMAL(10,2)
) PARTITION BY RANGE (sale_date);

-- 创建分区
CREATE TABLE sales_2023 PARTITION OF sales
FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');

CREATE TABLE sales_2024 PARTITION OF sales
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- 插入数据会自动路由到相应分区
INSERT INTO sales (sale_date, amount) 
VALUES ('2023-06-15', 1000.00);
```

### 外部数据包装器(FDW)

```sql
-- 创建外部服务器
CREATE EXTENSION postgres_fdw;

CREATE SERVER foreign_server
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'remote_host', port '5432', dbname 'remote_db');

-- 创建用户映射
CREATE USER MAPPING FOR local_user
SERVER foreign_server
OPTIONS (user 'remote_user', password 'remote_password');

-- 创建外部表
CREATE FOREIGN TABLE remote_users (
    id INTEGER,
    username VARCHAR(50),
    email VARCHAR(100)
) SERVER foreign_server
OPTIONS (schema_name 'public', table_name 'users');

-- 查询外部表
SELECT * FROM remote_users WHERE id < 100;
```

### 继承表

```sql
-- 创建父表
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(50),
    model VARCHAR(50),
    year INTEGER
);

-- 创建子表
CREATE TABLE cars (
    doors INTEGER,
    fuel_type VARCHAR(20)
) INHERITS (vehicles);

CREATE TABLE motorcycles (
    engine_size INTEGER
) INHERITS (vehicles);

-- 插入数据
INSERT INTO cars (brand, model, year, doors, fuel_type)
VALUES ('Toyota', 'Camry', 2023, 4, 'Gasoline');

-- 查询所有车辆（包括子表）
SELECT * FROM vehicles;

-- 只查询父表
SELECT * FROM ONLY vehicles;
```

### 公用表表达式(CTE)

```sql
-- 简单CTE
WITH active_users AS (
    SELECT id, username FROM users WHERE is_active = TRUE
)
SELECT * FROM active_users WHERE username LIKE 'admin%';

-- 递归CTE
WITH RECURSIVE employee_hierarchy AS (
    -- 基础查询：顶级员工
    SELECT id, name, manager_id, 1 as level
    FROM employees 
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- 递归查询：下级员工
    SELECT e.id, e.name, e.manager_id, eh.level + 1
    FROM employees e
    JOIN employee_hierarchy eh ON e.manager_id = eh.id
)
SELECT * FROM employee_hierarchy ORDER BY level, name;

-- 多个CTE
WITH 
user_stats AS (
    SELECT user_id, COUNT(*) as post_count
    FROM posts 
    GROUP BY user_id
),
active_users AS (
    SELECT id, username 
    FROM users 
    WHERE is_active = TRUE
)
SELECT au.username, COALESCE(us.post_count, 0) as posts
FROM active_users au
LEFT JOIN user_stats us ON au.id = us.user_id;
```

## 监控和维护

### 数据库监控

```sql
-- 查看数据库大小
SELECT 
    datname,
    pg_size_pretty(pg_database_size(datname)) as size
FROM pg_database;

-- 查看表大小
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 查看索引使用情况
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- 查看缓存命中率
SELECT 
    sum(heap_blks_read) as heap_read,
    sum(heap_blks_hit) as heap_hit,
    sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio
FROM pg_statio_user_tables;
```

### 性能监控

```sql
-- 查看最耗时的查询
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    stddev_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- 查看锁等待
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocked_activity.usename AS blocked_user,
    blocking_locks.pid AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_statement,
    blocking_activity.query AS current_statement_in_blocking_process
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

### 维护任务

```sql
-- 手动VACUUM
VACUUM users;
VACUUM FULL users;  -- 回收空间但需要锁表
VACUUM ANALYZE users;

-- 自动VACUUM配置
ALTER TABLE users SET (
    autovacuum_vacuum_threshold = 1000,
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_threshold = 500,
    autovacuum_analyze_scale_factor = 0.05
);

-- 重新组织表
CLUSTER users USING idx_users_created_at;

-- 更新统计信息
ANALYZE users;

-- 检查表完整性
SELECT * FROM pg_stat_progress_vacuum;
```

## 扩展和插件

### 常用扩展

```sql
-- 安装扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "hstore";
CREATE EXTENSION IF NOT EXISTS "ltree";

-- 查看已安装扩展
\dx

-- UUID生成
SELECT uuid_generate_v4();

-- 相似度搜索
SELECT * FROM users WHERE username % 'john';

-- hstore操作
CREATE TABLE product_attributes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    attributes hstore
);

INSERT INTO product_attributes (name, attributes)
VALUES ('Laptop', 'color=>black, size=>15inch, ram=>16GB');

SELECT * FROM product_attributes 
WHERE attributes->'color' = 'black';
```

### 自定义函数和类型

```sql
-- 创建自定义类型
CREATE TYPE address AS (
    street TEXT,
    city TEXT,
    state TEXT,
    zip_code VARCHAR(10)
);

-- 使用自定义类型
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    address address
);

INSERT INTO customers (name, address)
VALUES ('John Doe', ROW('123 Main St', 'New York', 'NY', '10001'));

-- 创建自定义聚合函数
CREATE OR REPLACE FUNCTION custom_concat(text, text)
RETURNS text AS $
BEGIN
    RETURN $1 || ' | ' || $2;
END;
$ LANGUAGE plpgsql;

CREATE AGGREGATE string_concat (
    sfunc = custom_concat,
    basetype = text,
    stype = text
);
```

## 最佳实践

### 数据库设计原则

1. **正规化设计**: 避免数据冗余，遵循正规化原则
2. **合理的数据类型**: 选择最适合的数据类型
3. **主键和外键**: 确保数据完整性
4. **索引策略**: 在查询频繁的列上创建索引
5. **命名规范**: 使用清晰的命名约定

### 性能优化建议

```sql
-- 避免SELECT *
-- 不好的做法
SELECT * FROM users WHERE id = 1;

-- 好的做法
SELECT username, email FROM users WHERE id = 1;

-- 使用LIMIT
SELECT username FROM users ORDER BY created_at DESC LIMIT 10;

-- 使用EXISTS而不是IN（对于大数据集）
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM posts p WHERE p.user_id = u.id);

-- 使用适当的连接类型
SELECT u.username, p.title
FROM users u
INNER JOIN posts p ON u.id = p.user_id
WHERE u.is_active = TRUE;
```

### 安全最佳实践

```sql
-- 使用参数化查询防止SQL注入
-- 应用层代码示例（伪代码）
-- 不好: "SELECT * FROM users WHERE id = " + user_input
-- 好: "SELECT * FROM users WHERE id = $1" with parameter

-- 最小权限原则
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE myapp TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE ON users TO app_user;

-- 定期更换密码
ALTER USER app_user WITH PASSWORD 'new_secure_password';

-- 使用SSL连接
-- 在连接字符串中添加 sslmode=require
```

### 备份策略

```bash
#!/bin/bash
# 自动备份脚本示例

# 配置
DB_NAME="myapp"
DB_USER="postgres"
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
pg_dump -U $DB_USER -Fc $DB_NAME > $BACKUP_DIR/${DB_NAME}_$DATE.dump

# 删除7天前的备份
find $BACKUP_DIR -name "${DB_NAME}_*.dump" -mtime +7 -delete

# 发送备份通知
echo "Database backup completed: ${DB_NAME}_$DATE.dump" | mail -s "PostgreSQL Backup" admin@example.com
```

### 监控脚本

```sql
-- 创建监控视图
CREATE VIEW db_health_check AS
SELECT 
    'Database Size' as metric,
    pg_size_pretty(pg_database_size(current_database())) as value
UNION ALL
SELECT 
    'Active Connections',
    COUNT(*)::text
FROM pg_stat_activity
WHERE state = 'active'
UNION ALL
SELECT 
    'Cache Hit Ratio',
    ROUND((sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) * 100)::numeric, 2)::text || '%'
FROM pg_statio_user_tables;

-- 查看健康状态
SELECT * FROM db_health_check;
```

## 故障排除

### 常见问题和解决方案

#### 连接问题

```sql
-- 检查连接限制
SHOW max_connections;

-- 查看当前连接
SELECT COUNT(*) FROM pg_stat_activity;

-- 终止空闲连接
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle' AND state_change < NOW() - INTERVAL '1 hour';
```

#### 性能问题

```sql
-- 查找慢查询
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
WHERE mean_time > 1000  -- 超过1秒的查询
ORDER BY mean_time DESC;

-- 检查锁等待
SELECT * FROM pg_locks WHERE NOT granted;

-- 检查表膨胀
SELECT 
    schemaname,
    tablename,
    n_dead_tup,
    n_live_tup,
    ROUND(n_dead_tup::numeric / (n_live_tup + n_dead_tup) * 100, 2) as bloat_ratio
FROM pg_stat_user_tables
WHERE n_live_tup > 0
ORDER BY bloat_ratio DESC;
```

#### 磁盘空间问题

```sql
-- 查看最大的表
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;

-- 清理临时文件
SELECT pg_ls_dir('base/pgsql_tmp');
```

## 升级和迁移

### 版本升级

```bash
# 使用pg_upgrade升级
pg_upgrade \
  --old-bindir=/usr/lib/postgresql/13/bin \
  --new-bindir=/usr/lib/postgresql/14/bin \
  --old-datadir=/var/lib/postgresql/13/main \
  --new-datadir=/var/lib/postgresql/14/main \
  --check

# 执行升级
pg_upgrade \
  --old-bindir=/usr/lib/postgresql/13/bin \
  --new-bindir=/usr/lib/postgresql/14/bin \
  --old-datadir=/var/lib/postgresql/13/main \
  --new-datadir=/var/lib/postgresql/14/main
```

### 数据迁移

```bash
# 迁移到其他服务器
pg_dump -h source_host -U postgres source_db | \
psql -h target_host -U postgres target_db

# 并行迁移
pg_dump -h source_host -U postgres -j 4 -Fd source_db -f backup_dir
pg_restore -h target_host -U postgres -j 4 -d target_db backup_dir
```

## 总结

PostgreSQL是一个功能强大、特性丰富的数据库系统。本文档涵盖了从基础操作到高级特性的全面内容。在实际使用中，建议：

1. **从基础开始**: 掌握基本的SQL操作和数据库概念
2. **渐进学习**: 根据需要逐步学习高级特性
3. **实践应用**: 通过实际项目加深理解
4. **关注性能**: 始终考虑查询性能和数据库优化
5. **保持安全**: 遵循安全最佳实践
6. **定期维护**: 建立合适的备份和监控机制

PostgreSQL的生态系统非常丰富，还有许多扩展和工具可以进一步增强其功能。持续学习和实践是掌握PostgreSQL的关键。
