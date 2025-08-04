package com.yupi.springbootinit.api;

import com.alibaba.dashscope.aigc.generation.Generation;
import com.alibaba.dashscope.aigc.generation.GenerationResult;
import com.alibaba.dashscope.aigc.generation.models.QwenParam;
import com.alibaba.dashscope.common.Message;
import com.alibaba.dashscope.common.Role;
import com.alibaba.dashscope.exception.ApiException;
import com.alibaba.dashscope.exception.InputRequiredException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import com.alibaba.dashscope.utils.Constants;
import com.yupi.springbootinit.manager.MessageManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class OpenAiApi {

    // 默认系统提示词
    private static final String DEFAULT_SYSTEM_PROMPT = "You are a helpful assistant.";

    /**
     * 统一的对话接口
     * @param question 用户问题
     * @param prompt 自定义系统提示词（可为null，使用默认值）
     */
    public String converse(String question, String prompt)
            throws ApiException, NoApiKeyException, InputRequiredException {
        // 配置API密钥（建议移到配置文件）
        Constants.apiKey = "sk-b963e121844242ed833e3e6fbf599ebd";

        // 初始化组件
        Generation gen = new Generation();
        MessageManager msgManager = new MessageManager(10);

        // 选择提示词（优先使用自定义，否则用默认）
        String systemPrompt = prompt != null ? prompt : DEFAULT_SYSTEM_PROMPT;

        // 构建消息
        Message systemMsg = Message.builder()
                .role(Role.SYSTEM.getValue())
                .content(systemPrompt)
                .build();
        Message userMsg = Message.builder()
                .role(Role.USER.getValue())
                .content(question)
                .build();

        msgManager.add(systemMsg);
        msgManager.add(userMsg);

        // 构建请求参数
        QwenParam param = QwenParam.builder()
                .model(Generation.Models.QWEN_TURBO)
                .messages(msgManager.get())
                .resultFormat(QwenParam.ResultFormat.MESSAGE)
                .topP(0.8)
                .enableSearch(true)
                .build();

        // 调用模型并返回结果
        GenerationResult result = gen.call(param);
        return result.getOutput().getChoices().get(0).getMessage().getContent();
    }

    // 保留便捷方法（可选）
    public String simpleMultiModalConversationCall(String question, String prompt)
            throws ApiException, NoApiKeyException, InputRequiredException {
        return converse(question, null); // 使用默认prompt
    }
}
