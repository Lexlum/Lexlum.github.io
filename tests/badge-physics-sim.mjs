// WorkBadge 物理核心的离线仿真——与 src/components/WorkBadge.tsx 的 step() 保持同一套常数。
// 运行：node tests/badge-physics-sim.mjs

const ROPE_POINTS = 11;
const GRAVITY = 2600;
const ITERATIONS = 6;
const FIXED = 1 / 60;
const VMAX = 24; // 单点每帧最大位移（px/帧）
const STAGE_W = 330;
const STAGE_H = 576;
const BASE_W = 236;
const BASE_H = 384;
const CLIP_H = 30;
const CARD_SCALE = 1;
// 视口硬边界（仿真里舞台即视口，stageLeft = 0）
const BOUND_LEFT = (BASE_W * CARD_SCALE) / 2 + 6 + 8;
const BOUND_RIGHT = STAGE_W - (BASE_W * CARD_SCALE) / 2 - 6 - 8;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function makeWorld() {
  const ropeLen = Math.max(40, STAGE_H - BASE_H - CLIP_H - 6);
  const segLen = ropeLen / (ROPE_POINTS - 1);
  const rope = Array.from({ length: ROPE_POINTS }, (_, i) => ({
    x: STAGE_W / 2,
    y: i * segLen,
    px: STAGE_W / 2,
    py: i * segLen,
  }));
  return { rope, segLen };
}

/** 把抓取目标钳制到绳长可达范围内（与组件的抓取逻辑一致） */
function clampGrab(grab) {
  const ax = STAGE_W / 2;
  const maxReach = (ROPE_POINTS - 1) * world_segLen * 0.96;
  let gx = grab.x - ax;
  let gy = grab.y;
  const gd = Math.hypot(gx, gy);
  if (gd > maxReach) {
    gx *= maxReach / gd;
    gy *= maxReach / gd;
  }
  return { x: ax + gx, y: gy };
}

let world_segLen = 0;

function step(world, state, dt, t, grab) {
  const { rope, segLen } = world;
  world_segLen = segLen;
  const ax = STAGE_W / 2;
  const breeze = 200 * Math.sin(t * 0.00037) + 110 * Math.sin(t * 0.00071 + 1.7);
  for (let i = 1; i < ROPE_POINTS; i++) {
    const p = rope[i];
    const depth = i / (ROPE_POINTS - 1);
    const wind = breeze * depth * depth + state.scrollKick * depth;
    let vx = (p.x - p.px) * 0.985;
    let vy = (p.y - p.py) * 0.985;
    const vlen = Math.hypot(vx, vy);
    if (vlen > VMAX) {
      vx *= VMAX / vlen;
      vy *= VMAX / vlen;
    }
    p.px = p.x;
    p.py = p.y;
    p.x += vx + wind * dt * dt;
    p.y += vy + GRAVITY * dt * dt;
  }
  if (grab) {
    const p = rope[ROPE_POINTS - 1];
    const target = clampGrab(grab);
    p.x += (target.x - p.x) * 0.35;
    p.y += (target.y - p.y) * 0.35;
  }
  rope[0].x = ax;
  rope[0].y = 0;
  for (let k = 0; k < ITERATIONS; k++) {
    for (let i = 0; i < ROPE_POINTS - 1; i++) {
      const a = rope[i];
      const b = rope[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 1e-6;
      const diff = (dist - segLen) / dist;
      if (i === 0) {
        b.x -= dx * diff;
        b.y -= dy * diff;
      } else {
        const half = diff * 0.5;
        a.x += dx * half;
        a.y += dy * half;
        b.x -= dx * half;
        b.y -= dy * half;
      }
    }
    rope[0].x = ax;
    rope[0].y = 0;
  }
  // 视口硬边界（与组件一致）
  const end = rope[ROPE_POINTS - 1];
  end.x = clamp(end.x, BOUND_LEFT, BOUND_RIGHT);
  end.y = clamp(end.y, -36, STAGE_H - 30);

  const prev = rope[ROPE_POINTS - 2];
  const segAng = Math.atan2(end.x - prev.x, end.y - prev.y);
  state.angVel += ((segAng - state.ang) * 80 - state.angVel * 13) * dt;
  state.angVel = clamp(state.angVel, -9, 9);
  state.ang += state.angVel * dt;
  state.flipVel += (state.flipTarget - state.flipAng) * 160 * dt;
  state.flipVel *= Math.pow(3.2e-6, dt);
  state.flipAng += state.flipVel * dt;
  return { end };
}

const assert = (cond, msg) => {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`PASS: ${msg}`);
};

// ---- 1. 静置：微风平衡下近似竖直、数值稳定 ----
{
  const world = makeWorld();
  const state = { ang: 0, angVel: 0, flipAng: 0, flipVel: 0, flipTarget: 0, scrollKick: 0 };
  let end;
  for (let i = 0; i < 600; i++) end = step(world, state, FIXED, i * FIXED * 1000).end;
  assert(Math.abs(end.x - STAGE_W / 2) < 8, `静置时卡片近似居中 (x=${end.x.toFixed(2)})`);
  assert(Math.abs(state.ang) < 0.06, `静置时摆角接近竖直 (ang=${state.ang.toFixed(4)})`);
  assert(Number.isFinite(end.x) && Number.isFinite(end.y), "无数值爆炸 (NaN/Inf)");
  let maxErr = 0;
  for (let i = 0; i < ROPE_POINTS - 1; i++) {
    const d = Math.hypot(world.rope[i].x - world.rope[i + 1].x, world.rope[i].y - world.rope[i + 1].y);
    maxErr = Math.max(maxErr, Math.abs(d - world.segLen));
  }
  assert(maxErr < 1.5, `绳段约束误差 < 1.5px (maxErr=${maxErr.toFixed(3)})`);
}

// ---- 2. 抓取拖拽：绳端跟随手（抓点在可达范围内） ----
{
  const world = makeWorld();
  const state = { ang: 0, angVel: 0, flipAng: 0, flipVel: 0, flipTarget: 0, scrollKick: 0 };
  let end;
  for (let i = 0; i < 120; i++) end = step(world, state, FIXED, i * 16.7, { x: 120, y: 140 }).end;
  assert(Math.abs(end.x - 120) < 16 && Math.abs(end.y - 140) < 10, `拖拽时绳端跟随手 (end=${end.x.toFixed(1)},${end.y.toFixed(1)})`);
  assert(Math.abs(state.ang) > 0.2, `拖拽时卡片摆角倾斜 (ang=${state.ang.toFixed(3)})`);
}

// ---- 3. 松手甩动：有摆动、能衰减归位 ----
{
  const world = makeWorld();
  const state = { ang: 0, angVel: 0, flipAng: 0, flipVel: 0, flipTarget: 0, scrollKick: 0 };
  for (let i = 0; i < 120; i++) step(world, state, FIXED, i * 16.7, { x: 120, y: 140 });
  let maxSwing = 0;
  let end;
  for (let i = 120; i < 600; i++) {
    end = step(world, state, FIXED, i * 16.7, null).end;
    maxSwing = Math.max(maxSwing, Math.abs(end.x - STAGE_W / 2));
  }
  assert(maxSwing > 12, `松手后产生摆动 (maxSwing=${maxSwing.toFixed(1)}px)`);
  assert(Math.abs(end.x - STAGE_W / 2) < 8, `8 秒后摆动衰减归位 (x=${end.x.toFixed(2)})`);
}

// ---- 4. 暴力甩出测试：往远处猛拽再松手，卡片绝不能飞出视口 ----
{
  const world = makeWorld();
  const state = { ang: 0, angVel: 0, flipAng: 0, flipVel: 0, flipTarget: 0, scrollKick: 0 };
  let min = Infinity, max = -Infinity, minTop = Infinity;
  // 模拟把手甩到舞台外很远（组件里指针坐标会被钳制，这里直接喂界外坐标验证钳制路径）
  for (let i = 0; i < 90; i++) {
    const { end } = step(world, state, FIXED, i * 16.7, { x: -400, y: 900 });
    min = Math.min(min, end.x); max = Math.max(max, end.x); minTop = Math.min(minTop, end.y);
  }
  for (let i = 90; i < 480; i++) {
    const { end } = step(world, state, FIXED, i * 16.7, null);
    min = Math.min(min, end.x); max = Math.max(max, end.x); minTop = Math.min(minTop, end.y);
  }
  assert(min >= BOUND_LEFT - 0.5, `左边界不越界 (minX=${min.toFixed(1)} ≥ ${BOUND_LEFT.toFixed(1)})`);
  assert(max <= BOUND_RIGHT + 0.5, `右边界不越界 (maxX=${max.toFixed(1)} ≤ ${BOUND_RIGHT.toFixed(1)})`);
  assert(minTop >= -36.5, `上边界不越界 (minY=${minTop.toFixed(1)})`);
  const endX = world.rope[ROPE_POINTS - 1].x;
  assert(Math.abs(endX - STAGE_W / 2) < 8, `暴力甩出后仍归位 (x=${endX.toFixed(2)})`);
}

// ---- 5. 滚动冲击：滚动气流不会把卡片推出边界 ----
{
  const world = makeWorld();
  const state = { ang: 0, angVel: 0, flipAng: 0, flipVel: 0, flipTarget: 0, scrollKick: 240 };
  let min = Infinity, max = -Infinity;
  let end;
  for (let i = 0; i < 600; i++) {
    end = step(world, state, FIXED, i * 16.7, null).end;
    min = Math.min(min, end.x); max = Math.max(max, end.x);
  }
  assert(min >= BOUND_LEFT - 0.5 && max <= BOUND_RIGHT + 0.5, `滚动冲击下不越界 (x∈[${min.toFixed(1)}, ${max.toFixed(1)}])`);
}

// ---- 6. 翻转弹簧：收敛 180°、带回弹 ----
{
  const world = makeWorld();
  const state = { ang: 0, angVel: 0, flipAng: 0, flipVel: 0, flipTarget: Math.PI, scrollKick: 0 };
  let crossed = false;
  let overshoot = 0;
  for (let i = 0; i < 600; i++) {
    step(world, state, FIXED, i * 16.7, null);
    if (!crossed && state.flipAng >= Math.PI) crossed = true;
    else if (crossed) overshoot = Math.max(overshoot, Math.abs(state.flipAng - Math.PI));
  }
  assert(Math.abs(state.flipAng - Math.PI) < 0.005, `翻转收敛到 180° (err=${Math.abs(state.flipAng - Math.PI).toFixed(5)})`);
  assert(overshoot > 0.1 && overshoot < 2.0, `翻转带回弹过冲 (overshoot=${overshoot.toFixed(3)} rad)`);
}

// ---- 7. 收起（下滑收缩成小徽章）：绳长插值收缩后，卡片升到导航栏下方并保持稳定 ----
{
  const world = makeWorld();
  const state = { ang: 0, angVel: 0, flipAng: 0, flipVel: 0, flipTarget: 0, scrollKick: 0 };
  const COLLAPSED_SEG_LEN = 7;
  const fullSegLen = world.segLen;
  let ext = 1;
  const extTarget = 0; // 已下滑
  let end;
  for (let i = 0; i < 480; i++) {
    ext += (extTarget - ext) * Math.min(1, FIXED * 4.5);
    world.segLen = COLLAPSED_SEG_LEN + (fullSegLen - COLLAPSED_SEG_LEN) * ext;
    end = step(world, state, FIXED, i * 16.7, null).end;
  }
  const restY = (ROPE_POINTS - 1) * world.segLen;
  assert(world.segLen < COLLAPSED_SEG_LEN + 0.01, `织带收缩到位 (segLen=${world.segLen.toFixed(2)})`);
  assert(Math.abs(end.y - restY) < 18, `收起后卡片吊在导航栏正下方 (y=${end.y.toFixed(1)} ≈ ${restY.toFixed(1)})`);
  assert(end.y < 130, `收起后卡片明显上移 (y=${end.y.toFixed(1)} < 130)`);
  assert(end.x > BOUND_LEFT && end.x < BOUND_RIGHT, `收起过程中不越界 (x=${end.x.toFixed(1)})`);
}

console.log("\n全部物理仿真通过 ✅");
