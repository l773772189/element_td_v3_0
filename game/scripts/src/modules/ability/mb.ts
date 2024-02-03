import { reloadable } from '../../utils/tstl-utils';
import { BaseAbility, registerAbility } from '../../utils/dota_ts_adapter';

@reloadable
@registerAbility('mb')
class mb extends BaseAbility {
    OnSpellStart(): void {
        print('后端开始执行技能了');
        // @ts-ignore
        const caster = this.GetCaster();
        // 获取施法单位的玩家ID
        const playerId = caster.GetPlayerOwnerID();
        // 使用PlayerResource获取玩家实体
        const player = PlayerResource.GetPlayer(playerId);
        // @ts-ignore
        CustomGameEventManager.Send_ServerToPlayer(player, 'startBuild', null);
    }
}
