export class Build {
    public printObject(obj: any): void {
        print('打印键值对');
        for (const [key, value] of Object.entries(obj)) {
            print(`${key}: ${value}`);
        }
    }

    constructor() {
        print('监听器执行后端');
        CustomGameEventManager.RegisterListener('buildAtPosition', (eventSourceIndex: number, args: any) => {
            DeepPrintTable(args);
            const position = args.position;
            print(position['0']);
            print(position['1']);
            print(position['2']);
            // 假设 'npc_dota_hero_axe' 是你想要创建的单位名称
            // 'null' 是单位的所有者，对于中立单位可以为 null
            // position 是一个包含 x, y, z 坐标的数组，例如 [0, 0, 0]
            // -1 表示使用默认的队伍
            const unitName = 'npc_dota_hero_axe';
            const team = -1;
            const owner = null;
            const unit = CreateUnitByName(unitName, Vector(position['0'] - 25, position['1'] - 25, position['2']), true, owner, owner, team);
        });
    }
}
