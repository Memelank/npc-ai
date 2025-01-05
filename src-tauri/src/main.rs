// Prevents additional console window on Windows in release, DO NOT REMOVE!!
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// fn main() {
//   app_lib::run();
// }

use tauri::command;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct ChatRequest {
    model: String,
    messages: Vec<MessageInput>,
}

#[derive(Deserialize)]
struct MessageInput {
    role: String,
    content: String,
}

#[derive(Serialize)]
struct ChatResponse {
    message: ChatMessage,
    done: bool,
}

#[derive(Serialize)]
struct ChatMessage {
    content: String,
}

#[command]
async fn chat(request: ChatRequest) -> Result<ChatResponse, String> {
    // Implement your chat logic here.
    // For example, call an external API or process the message.

    // Dummy response for illustration
    Ok(ChatResponse {
        message: ChatMessage {
            content: format!("Echo: {}", request.messages.last().unwrap().content),
        },
        done: true,
    })
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![chat])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}