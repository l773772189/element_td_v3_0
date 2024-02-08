// 通过id查找dota面板
Game.find_dota_hud_element = function (id) {
    var hudRoot;
    for (panel = $.GetContextPanel(); panel != null; panel = panel.GetParent()) {
        hudRoot = panel;
    }
    var comp = hudRoot.FindChildTraverse(id);
    return comp;
};

// 通过id隐藏dota面板
Game.hide_dota_hud_element = function (id) {
    var hud = $.GetContextPanel().GetParent().GetParent();
    var element = hud.FindChildTraverse(id);
    if (element != null) {
        element.style.visibility = 'collapse';
    }
    return element;
};

// 通过id显示dota面板
Game.show_dota_hud_element = function (id) {
    var hud = $.GetContextPanel().GetParent().GetParent();
    var element = hud.FindChildTraverse(id);
    if (element != null) {
        element.style.visibility = 'visible';
    }
    return element;
};

// 整数和浮点数自动切换
Game.AutoIntAndFloat = function (value) {
    var number;
    if ((value * 10) % 10 == 0) {
        number = value.toFixed(0);
    } else {
        number = value.toFixed(2);
    }
    return number;
};

// 伤害数据转换
Game.DamageTransformation = function (damage) {
    var args = 0;
    if (damage >= 1000000) {
        args = (damage / 1000000).toFixed(2);
        return args + 'M';
    } else {
        args = (damage / 1000).toFixed(2);
        return args + 'K';
    }
};

// 获取技能行为表
Game.GetBehaviorList = function (number) {
    if (number) {
        if (number <= 0) return null;
        var num = number.toString(2);
        var numList = num.split('');
        var newList = [];
        for (var i = 0, len = numList.length; i < len; i += 1) {
            if (numList[i] == 1) {
                newList.push(Math.pow(2, len - i - 1));
            }
        }
        return newList;
    }
};

// 判断是否有该行为
Game.IsHasAbilityBehavior = function (nNum, hBehaviorList) {
    var bHas = false;
    for (var i = 0; i <= hBehaviorList.length; i++) {
        if (nNum == hBehaviorList[i]) {
            bHas = true;
        }
    }

    return bHas;
};

//////////////////////////英雄经验表////////////////////////////////////
Game.HERO_LEVEL = []; // 英雄等级经验表

// 初始化英雄经验等级表
Game.InitHeroXPLevelTable = function (xp) {
    for (var i = 0; i <= 2000; i++) {
        var xp = 0;

        if (i <= 0) {
            xp = 0;
        } else if (i <= 100) {
            xp = 400 + Game.HERO_LEVEL[i - 1];
        } else if (i <= 200) {
            xp = 800 + Game.HERO_LEVEL[i - 1];
        } else if (i <= 300) {
            xp = 1600 + Game.HERO_LEVEL[i - 1];
        } else if (i <= 400) {
            xp = 3200 + Game.HERO_LEVEL[i - 1];
        } else if (i <= 500) {
            xp = 6400 + Game.HERO_LEVEL[i - 1];
        } else if (i <= 600) {
            xp = 12800 + Game.HERO_LEVEL[i - 1];
        } else if (i <= 700) {
            xp = 25600 + Game.HERO_LEVEL[i - 1];
        } else if (i <= 800) {
            xp = 51200 + Game.HERO_LEVEL[i - 1];
        } else if (i <= 900) {
            xp = 102400 + Game.HERO_LEVEL[i - 1];
        } else if (i <= 1000) {
            xp = 204800 + Game.HERO_LEVEL[i - 1];
        } else if (i <= 2000) {
            xp = 409600 + Game.HERO_LEVEL[i - 1];
        }

        Game.HERO_LEVEL[i] = xp;

        // $.Msg("================"+i)
        // $.Msg("----------------"+xp)
    }
};

// 获取英雄等级
Game.getHeroLevel = function (xp) {
    var lv = 0;
    for (var i = 0; i <= 2000; i++) {
        if (xp >= Game.HERO_LEVEL[i]) {
            lv = i;
        }
    }

    return lv;
};

// 获取当前英雄等级所需的英雄经验
Game.getNowHeroLevelNeedXP = function (lv) {
    var xp = 0;
    if (lv == 2000) {
        xp = Game.HERO_LEVEL[lv];
    } else {
        xp = Game.HERO_LEVEL[lv + 1] - Game.HERO_LEVEL[lv];
    }

    return xp;
};

// 获取当前英雄等级已有的英雄经验
Game.getNowHeroLevelHasXP = function (nHeroXP) {
    var xp = 0;
    var lv = Game.getHeroLevel(nHeroXP);
    xp = nHeroXP - Game.HERO_LEVEL[lv];

    return xp;
};

// 整数和浮点数自动切换
Game.AutoIntAndFloat = function (value) {
    if (typeof value != 'number') {
        return value;
    }
    var number;
    if ((value * 10) % 10 == 0) {
        number = value.toFixed(0);
    } else {
        number = value.toFixed(2);
    }
    return number;
};

//播放音效（短音效）
function OnGameSound(data) {
    Game.EmitSound(data.SoundName);
}
// 错误提示
function send_error_message(args) {
    const message = args.message;
    console.log('我接收到錯誤信息l');
    var eventData = { reason: 80, message: message };
    GameEvents.SendEventClientSide('dota_hud_error_message', eventData);
}

function ShowCamera(args) {
    if (args.Index == null || args.Index == undefined) {
        GameUI.SetCameraTargetPosition(args.Vec, 0.05);
    }
    if (args.Index != null || args.Index != undefined) {
        GameUI.SelectUnit(args.Index, false);
    }
}
// 地图
function AutoCameraDistance() {
    if (Game.GetState() == 10) {
        var nUnitIndex = Players.GetLocalPlayerPortraitUnit();
        var vPos = Entities.GetAbsOrigin(nUnitIndex);
        // $.Msg(Game.GetMapInfo())
        var nDistance = 1500;
        if (vPos == undefined) {
            nDistance = 1500;
        } else {
            // $.Msg("======================="+vPos[2])
            // nDistance = 1200 + (vPos[2] - 640)
            nDistance = nDistance + vPos[2];
        }
        nDistance = 2000;
        // $.Msg(nDistance)
        GameUI.SetCameraDistance(nDistance);
        $.Schedule(Game.GetGameFrameTime(), AutoCameraDistance);
    } else {
        $.Schedule(1, AutoCameraDistance);
    }
}

(function () {
    // GameEvents.Subscribe("game_sound", OnGameSound);
    console.log('我被訂閱了');
    GameEvents.Subscribe('send_error_message_client', send_error_message);
    // GameEvents.Subscribe( "Show_Camera", ShowCamera );

    // GameEvents.Subscribe( "auto_camera_distance", AutoCameraDistance );
    // $.Schedule(1, AutoCameraDistance);
})();
