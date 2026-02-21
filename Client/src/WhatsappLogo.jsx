import React from 'react';
import { MessageCircle } from 'lucide-react';

function WhatsappLogo() {
  return (
    <>
      <style>
        {`
          .chat-float {
            position: fixed;
            overflow: hidden;
            width: 56px;
            height: 56px;
            bottom: 60px;
            right: 40px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #FFF;
            border-radius: 50%;
            text-align: center;
            font-size: 28px;
            box-shadow: 0 8px 25px rgba(245, 158, 11, 0.35);
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid rgba(255,255,255,0.2);
          }
          
          .chat-float:hover {
            width: 180px;
            border-radius: 28px;
            background: linear-gradient(135deg, #d97706, #b45309);
            box-shadow: 0 12px 35px rgba(217, 119, 6, 0.45);
            transform: translateY(-2px);
          }
          
          .chat-float-icon {
            position: absolute;
            color: white;
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .chat-float-text {
            opacity: 0;
            position: absolute;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.05em;
            white-space: nowrap;
            left: 50%;
            transform: translateX(-50%);
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            margin-left: 36px;
          }
          
          .chat-float:hover .chat-float-icon {
            left: 18px;
          }
          
          .chat-float:hover .chat-float-text {
            opacity: 1;
            left: 56px;
          }

          @media (max-width: 768px) {
            .chat-float {
              bottom: 80px;
              right: 16px;
              width: 50px;
              height: 50px;
            }
            .chat-float:hover {
              width: 50px;
              border-radius: 50%;
            }
            .chat-float:hover .chat-float-text {
              display: none;
            }
            .chat-float:hover .chat-float-icon {
              left: auto;
            }
          }
        `}
      </style>

      <button
        onClick={() => window.dispatchEvent(new CustomEvent('TOGGLE_CHAT'))}
        className="chat-float border-none outline-none cursor-pointer"
        aria-label="Open Chat"
      >
        <MessageCircle className="chat-float-icon" size={24} />
        <span className="chat-float-text">Chat with Us</span>
      </button>
    </>
  );
}

export default WhatsappLogo;