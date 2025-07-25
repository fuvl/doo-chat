import { useAuth } from "../../contexts/auth";
import { Button } from "../../components/button";
import { Input } from "../../components/input";

export function Chat() {
  const {} = useAuth();

  return (
    <div className="h-screen flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[640px] mx-auto px-6 py-6 space-y-4">
          {/* Messages will go here */}
        </div>
      </div>

      {/* Input Area */}
      <div className="px-4 py-4 bg-bottom-bar">
        <div className="max-w-[640px] mx-auto flex space-x-3">
          <Input
            type="text"
            placeholder="Message"
            className="flex-1 bg-white border-0"
          />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
}
