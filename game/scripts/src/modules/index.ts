import { Debug } from './Debug';
import { GameConfig } from './GameConfig';
import { XNetTable } from './xnet-table';
import { Build } from './Build';

declare global {
    interface CDOTAGameRules {
        // 声明所有的GameRules模块，这个主要是为了方便其他地方的引用（保证单例模式）
        XNetTable: XNetTable;
    }
}

/**
 * 这个方法会在game_mode实体生成之后调用，且仅调用一次
 * 因此在这里作为单例模式使用
 **/
export function ActivateModules() {
    if (GameRules.XNetTable == null) {
        // 初始化所有的GameRules模块
        GameRules.XNetTable = new XNetTable();
        // 如果某个模块不需要在其他地方使用，那么直接在这里使用即可
        new GameConfig();
        // 初始化测试模块xD
        new Debug();
        new Build();
        Timers.CreateTimer(3, () => {
            const player = PlayerResource.GetPlayer(0);
            const hero = player.GetAssignedHero();
            const abilityBuff = hero.AddAbility('mb');
            abilityBuff.SetLevel(1);
        });
        // @ts-ignore-
        Timers.CreateTimer(4, () => {
            // @ts-ignore
            CustomNetTables.SetTableValue('lz', 'v', { value: '123' });
        });
    }
}
