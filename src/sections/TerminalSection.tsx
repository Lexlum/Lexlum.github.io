import TerminalLog from "../components/TerminalLog";

/**
 * 终端日志打字机区块 —— 替换原 MarqueeSection（跑马灯）。
 * 跑马灯代码保留在 MarqueeSection.tsx，已从 App 移除；
 * 后续写博客时可能换回滚动展示。
 */
export default function TerminalSection() {
  return (
    <section className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 flex justify-center px-5 sm:px-8 md:px-10">
      <TerminalLog />
    </section>
  );
}
