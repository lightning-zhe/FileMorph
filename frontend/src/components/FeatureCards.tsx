import { Shield, Zap, Image, Monitor } from 'lucide-react';

const features = [
  {
    icon: Monitor,
    title: '本地转换',
    desc: '在您的设备上运行，文件不会上传到云端',
  },
  {
    icon: Zap,
    title: '快速导出',
    desc: 'LibreOffice + PyMuPDF 驱动，转换速度飞快',
  },
  {
    icon: Image,
    title: '多格式支持',
    desc: 'Word、PPT、PDF、图片之间灵活互转',
  },
  {
    icon: Shield,
    title: '简洁安全',
    desc: '文件 10 分钟后自动清除，不留痕迹',
  },
];

export default function FeatureCards() {
  return (
    <footer className="hidden sm:block mt-16 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto px-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-slate-100 bg-white/60 backdrop-blur-sm p-5 hover:border-slate-200 hover:shadow-sm transition-all duration-200"
          >
            <f.icon className="h-5 w-5 text-slate-400 mb-3" />
            <h4 className="text-sm font-semibold text-slate-800">{f.title}</h4>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-slate-300 mt-10">
        FileMorph &mdash; 本地文件格式转换
      </p>
    </footer>
  );
}
