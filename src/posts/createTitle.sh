#!/bin/bash

# 启用递归匹配和空glob处理
shopt -s globstar nullglob

target_dir="/d/blogs/jk-ai/src/posts"

# 递归处理所有.md文件
for file in "$target_dir"/**/*.md; do
    # 获取不含扩展名的文件名
    filename=$(basename "$file" .md)
    
    # 生成临时文件路径（与源文件同目录）
    tmp_file="${file}.tmp"
    
    # 插入标题并保留原内容（兼容UTF-8编码）
    printf "# %s\n\n" "$filename" | cat - "$file" > "$tmp_file" && mv "$tmp_file" "$file"
    
    echo "已处理：$file"
done

echo "全部处理完成！"