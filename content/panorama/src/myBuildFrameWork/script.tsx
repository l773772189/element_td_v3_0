import React, { render } from 'react-panorama-x';
import { useEffect, useState } from 'react';
interface CenterPosition {
    x: number;
    y: number;
    z: number;
}
let particle: any = null;
let isBuilding = 0;

const gridSize = 150; // 定义h  v   hbcv n格子的大小
const gridSize2 = 75;

const App = () => {
    console.log('前端代码生效了123');
    GameEvents.Subscribe('startBuild', function (data) {
        isBuilding = 1;
    });
    useEffect(() => {
        // 确保此代码块在组件挂载后执行

        GameUI.SetMouseCallback((eventName: MouseEvent, arg: number) => {
            console.log('鼠标事件');
            if (eventName == 'pressed') {
                if (arg === 0) {
                    if (isBuilding === 0) {
                        //代表不是建筑形态
                        return true;
                    }
                    console.log('左键');
                    const mousePosition = GameUI.GetCursorPosition();
                    const gamePosition = Game.ScreenXYToWorld(mousePosition[0], mousePosition[1]);
                    if (gamePosition && gamePosition.length === 3) {
                        // 计算方块中心点坐标
                        const centerPosition: CenterPosition = {
                            x: Math.floor(gamePosition[0] / gridSize) * gridSize + gridSize / 2,
                            y: Math.floor(gamePosition[1] / gridSize) * gridSize + gridSize / 2,
                            z: gamePosition[2],
                        };
                        console.log(centerPosition.x, centerPosition.y, centerPosition.z);
                        // @ts-ignore
                        GameEvents.SendCustomGameEventToServer('buildAtPosition', {
                            position: [centerPosition.x - 40, centerPosition.y - 25, centerPosition.z]
                        });
                    }
                }

                // Disable right-click
                if (arg === 1) {
                    if (isBuilding) {
                        isBuilding = 0;
                    }
                    console.log('右键');
                    // 如果粒子效果已经被创建，销毁它
                    if (particle) {
                        Particles.DestroyParticleEffect(particle, true);
                        particle = null; // 重置particle变量
                    }
                }
            }
            return true;
        });
        // 组件卸载时的清理逻辑
        return () => {
            // 注销事件监听器等清理操作
        };
    }, []); // 空依赖数组表示这个 effect 只在组件挂载和卸载时运行

    const interval = setInterval(() => {
        if (!isBuilding) {
            return;
        }
        const mousePosition = GameUI.GetCursorPosition();
        const gamePosition = Game.ScreenXYToWorld(mousePosition[0], mousePosition[1]);

        if (gamePosition && gamePosition.length === 3) {
            // 将游戏位置调整为格子对齐
            const alignedPosition = [
                Math.floor(gamePosition[0] / gridSize) * gridSize,
                Math.floor(gamePosition[1] / gridSize) * gridSize,
                gamePosition[2],
            ];

            if (!particle) {
                // 创建粒子效果
                // @ts-ignore
                particle = Particles.CreateParticle('particles/buildinghelper/square_sprite.vpcf', ParticleAttachment_t.PATTACH_WORLDORIGIN, 0);
            }
            // 更新粒子位置
            // @ts-ignore
            Particles.SetParticleControl(particle, 0, alignedPosition); // 格子对齐的位置
            Particles.SetParticleControl(particle, 1, [gridSize2, 0, 0]); // 格子的大小
            Particles.SetParticleControl(particle, 2, [255, 255, 255]); // 颜色
            Particles.SetParticleControl(particle, 3, [100, 0, 0]); // 透明度
        }
    }, 30);

    return <Button></Button>;
};
// eslint-disable-next-line react-hooks/rules-of-hooks

// 在组件加载后设置鼠标事件监听器
render(<App />, $.GetContextPanel());
