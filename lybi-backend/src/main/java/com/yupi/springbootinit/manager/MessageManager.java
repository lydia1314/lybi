package com.yupi.springbootinit.manager;

import java.util.ArrayList;
import java.util.List;
import com.alibaba.dashscope.common.Message;

public class MessageManager {
    private final List<Message> messages;
    private final int maxSize; // 限制消息最大数量

    public MessageManager(int maxSize) {
        this.maxSize = maxSize;
        this.messages = new ArrayList<>();
    }

    // 添加消息，超过容量则移除最早的消息
    public void add(Message message) {
        if (messages.size() >= maxSize) {
            messages.remove(0); // 移除最早的消息
        }
        messages.add(message);
    }

    // 获取当前消息列表
    public List<Message> get() {
        return new ArrayList<>(messages); // 返回副本，避免外部修改
    }


}