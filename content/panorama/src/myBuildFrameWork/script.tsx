import React, { render } from 'react-panorama-x';
import { useEffect, useState } from 'react';
interface CenterPosition {
    x: number;
    y: number;
    z: number;
}
let particle: any = null;
let isBuilding = 0;

const gridSize = 250; // 定义h  v   hbcv n格子的大小
GameUI.SetMouseCallback((eventName: MouseEvent, arg: number) => {
    const mousePosition = GameUI.GetCursorPosition();
    const gamePosition = Game.ScreenXYToWorld(mousePosition[0], mousePosition[1]);
    const centerPosition: CenterPosition = {
        x: Math.floor(gamePosition[0] / gridSize) * gridSize,
        y: Math.floor(gamePosition[1] / gridSize) * gridSize,
        z: gamePosition[2],
    };
    if (eventName == 'pressed') {
        if (arg === 0) {
            console.log('鼠标实时位置', gamePosition[0], gamePosition[1]);
            console.log('取整位置', centerPosition.x, centerPosition.y, centerPosition.z);
            if (isBuilding === 0) {
                //代表不是建筑形态
                return false;
            } else {
                // @ts-ignore
                GameEvents.SendCustomGameEventToServer('buildAtPosition', {
                    position: [centerPosition.x + gridSize / 2, centerPosition.y + gridSize / 2, centerPosition.z],
                    radius: gridSize / 2,
                });
                return true;
            }
        }
        // Disable right-click
        if (arg === 1) {
            // @ts-ignore
            // 如果粒子效果已经被创建，销毁它
            if (particle) {
                Particles.DestroyParticleEffect(particle, true);
                particle = null; // 重置particle变量
            }
            if (isBuilding) {
                isBuilding = 0;
                return true;
            }
        }
    }
    return false;
});
const App = () => {
    GameEvents.Subscribe('startBuild', function (data) {
        isBuilding = 1;
    });
    const interval = setInterval(() => {
        if (!isBuilding) {
            return;
        }
        const mousePosition = GameUI.GetCursorPosition();
        const gamePosition = Game.ScreenXYToWorld(mousePosition[0], mousePosition[1]);

        if (gamePosition && gamePosition.length === 3) {
            // 将游戏位置调整为格子对齐
            const alignedPosition = [
                Math.floor(gamePosition[0] / gridSize) * gridSize + gridSize / 2,
                Math.floor(gamePosition[1] / gridSize) * gridSize + gridSize / 2,
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
            Particles.SetParticleControl(particle, 1, [250, 0, 0]); // 格子的大小
            Particles.SetParticleControl(particle, 2, [255, 255, 255]); // 颜色
            Particles.SetParticleControl(particle, 3, [20, 0, 0]); // 透明度
        }
    }, 30);

    return <Button></Button>;
};
// eslint-disable-next-line react-hooks/rules-of-hooks

// 在组件加载后设置鼠标事件监听器
render(<App />, $.GetContextPanel());

// 获取网表中的值，并使用类型断言确保tableValue的类型
// @ts-ignore
const tableValue = CustomNetTables.GetTableValue('lz', 'v') as { value: string } | undefined;

// 检查tableValue是否存在，避免访问undefined的属性
if (tableValue) {
    // 既然已经使用类型断言，我们可以安全地访问.value属性
    const actualValue = tableValue.value;
    console.log('网表的值: ' + actualValue);
} else {
    // 如果没有找到值，可能是因为键名不对或值尚未设置
    console.log('未能找到网表中的值');
}

// 设置一个监听器，监听 'lz' 网表的变化
CustomNetTables.SubscribeNetTableListener('lz', (tableName, key, data) => {
    // tableName 是发生变化的网表名
    // key 是变化的数据项的键名
    // data 是变化后的数据项的值
    console.log('我被监听了');
    // 检查是否是我们关注的键名
    if (key === 'v') {
        console.log('网表 lz 中 v 的值发生了变化:', data);
        // 根据变化后的数据更新 UI
        // 例如，更新页面上显示的值
        // document.getElementById('someElementId').innerText = data.value;
    }
});
