-- 拷贝表
function CopyTable(hTable)
	local tab = {}
	for k, v in pairs(hTable or {}) do
		if type(v) ~= "table" then
			tab[k] = v
		else
			tab[k] = CopyTable(v)
		end
	end
	return tab
end

-- 发送错误信息
function send_error_message_client(hPlayer,string)
    print('hPlayer')
    print(hPlayer)
    print('string')
    print(string)
	CustomGameEventManager:Send_ServerToPlayer(hPlayer,"send_error_message_client",{message=string})
end

-- 获取游戏时间 截取到s
function GetGameTimeInt()
	return math.floor(GameRules:GetDOTATime(false, true))
end

-- 获取指定玩家ID的金钱
function GetPlayerGold(nPlayerID)
    -- 确保提供的ID是有效的
    if nPlayerID and PlayerResource:IsValidPlayerID(nPlayerID) then
        -- 使用 PlayerResource:GetGold 函数获取玩家的金钱
        return PlayerResource:GetGold(nPlayerID)
    else
        return nil
    end
end

-- 从指定玩家ID的账户中扣除指定数量的金钱
function DeductPlayerGold(nPlayerID, nAmount)
    -- 确保提供的ID是有效的，并且扣除金额是一个正数
    if nPlayerID and nAmount and nAmount > 0 and PlayerResource:IsValidPlayerID(nPlayerID) then
        -- 使用 PlayerResource:ModifyGold 函数扣除金钱
        -- 参数：玩家ID，要扣除的金额，是否可见，来源（DOTA_ModifyGold_Unspecified 表示未指定来源）
        PlayerResource:ModifyGold(nPlayerID, -nAmount, false, DOTA_ModifyGold_Unspecified)
        return true
    else
        return false
    end
end
