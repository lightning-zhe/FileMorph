import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  onClick: () => void;
  disabled: boolean;
  waking: boolean;
}

export default function ConvertButton({ onClick, disabled, waking }: Props) {
  return (
    <Button
      size="lg"
      className="w-full"
      onClick={onClick}
      disabled={disabled || waking}
    >
      {waking ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          正在唤醒服务器，请稍候...
        </>
      ) : (
        '开始转换'
      )}
    </Button>
  );
}
