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
            // DeepPrintTable(args);
            const position = args.position;
            const radius = args.radius;
            const location = Vector(position['0'], position['1'], position['2']);
            const unitName = 'npc_kv_generator_test_tower';
            const team = 2;
            const owner = null;

            const teamFilter = 3;
            const typeFilter = 55;
            const flagFilter = 0;
            const order = 0;
            const canGrowCache = false;
            const units = FindUnitsInRadius(team, location, null, radius, teamFilter, typeFilter, flagFilter, order, canGrowCache);
            print('查找到的单位123' + units.length);
            let towerNum = 0;
            for (const unit1 of units) {
                if (unit1.GetUnitName().includes('tower')) {
                    towerNum++;
                }
            }
            if (towerNum >= 1) {
                print('已经有单位，无法建造');
                const nPlayerID = args.PlayerID as PlayerID;
                print(nPlayerID);
                const player = PlayerResource.GetPlayer(nPlayerID);
                print('playerObj' + player);
                send_error_message_client(player, '已经有单位，禁止建造');
                aa('a', 'b', 'c');
                return;
            }
            const unit = CreateUnitByName(unitName, location, true, owner, owner, team);
        });
    }
}
