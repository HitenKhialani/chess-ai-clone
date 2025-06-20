import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot } from 'lucide-react';

export interface BotMessage {
  id: number;
  text: string;
  timestamp: Date;
}

export interface BotMessagePanelProps {
  botName: string;
  messages: BotMessage[];
}

export function BotMessagePanel({ botName, messages }: BotMessagePanelProps) {
  return (
    <Card className="w-full h-[400px] bg-[#181f2a] border-[#818cf8]">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-[#818cf8]" />
          <h3 className="font-semibold text-[#818cf8]">{botName}'s Thoughts</h3>
        </div>
        <ScrollArea className="h-[320px] pr-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="bg-[#23263a] p-3 rounded-lg">
                <p className="text-sm text-gray-300">I'm ready to judge your moves! Make your first move and watch for my comments every few turns. 😏</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="bg-[#23263a] p-3 rounded-lg">
                  <p className="text-sm text-gray-300">{message.text}</p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function generateMessage(
  botName: string,
  lastMove: string | null,
  isCheck: boolean,
  isAttacking: boolean,
  evaluation: number
): string {
  const messages = {
    teasing: [
      "Hmm, interesting choice... but I've seen better! 😏",
      "That move? Really? I expected more from you! 😅",
      "Are you sure about that? I'm not impressed... 🤔",
    ],
    boasting: [
      "My position is looking quite strong, don't you think? 😎",
      "I'm playing some beautiful chess today! 🎯",
      "This is exactly how I planned it! 💪",
    ],
    praising: [
      "Not bad! You're learning quickly! 👏",
      "That was actually a pretty good move! 🎯",
      "I'm impressed by your play! Keep it up! 🌟",
    ],
    worried: [
      "Ouch! That's putting some pressure on me! 😰",
      "I need to be careful here... 🤔",
      "You're getting dangerous! I better watch out! 😅",
    ],
    check: [
      "Check! How do you like that? 😈",
      "Your king is looking a bit exposed! 👀",
      "Time to defend your majesty! 👑",
    ],
    winning: [
      "The position is clearly in my favor! 🏆",
      "I'm dominating this game! 💪",
      "This is going exactly as planned! 🎯",
    ],
    losing: [
      "You're playing really well! I'm in trouble! 😅",
      "I need to find something special here... 🤔",
      "This is getting tough for me! 😰",
    ],
  };

  let category: keyof typeof messages;
  if (isCheck) {
    category = 'check';
  } else if (isAttacking) {
    category = 'worried';
  } else if (evaluation > 2) {
    category = 'winning';
  } else if (evaluation < -2) {
    category = 'losing';
  } else if (Math.random() < 0.3) {
    category = 'boasting';
  } else if (Math.random() < 0.5) {
    category = 'teasing';
  } else {
    category = 'praising';
  }
  const messageList = messages[category];
  return messageList[Math.floor(Math.random() * messageList.length)];
} 