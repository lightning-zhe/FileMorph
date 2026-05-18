import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export default function ConvertButton({ onClick, disabled, loading }: Props) {
  return (
    <Button
      size="lg"
      className="w-full"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          转换中...
        </>
      ) : (
        '开始转换'
      )}
    </Button>
  );
}
