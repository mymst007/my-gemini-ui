document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('promptInput');
    const sendButton = document.getElementById('sendButton');
    const responseOutput = document.getElementById('responseOutput');
    const loadingDiv = document.getElementById('loading');
    const errorOutput = document.getElementById('errorOutput');

    // !!! 将此替换为你的 Cloudflare Worker 的 URL !!!
    const workerApiUrl = 'https://*.henrybus.workers.dev'; 

    sendButton.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('请输入你的问题！');
            return;
        }

        responseOutput.textContent = ''; // 清空之前的响应
        errorOutput.textContent = ''; // 清空之前的错误
        loadingDiv.classList.remove('hidden'); // 显示加载状态
        sendButton.disabled = true; // 禁用按钮防止重复提交

        try {
            const response = await fetch(workerApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '未知错误');
            }

            const data = await response.json();
            responseOutput.textContent = data.response; // 显示 Gemini 的响应

        } catch (error) {
            console.error('发送请求失败:', error);
            errorOutput.textContent = `发送请求失败: ${error.message}`;
        } finally {
            loadingDiv.classList.add('hidden'); // 隐藏加载状态
            sendButton.disabled = false; // 重新启用按钮
        }
    });
});

