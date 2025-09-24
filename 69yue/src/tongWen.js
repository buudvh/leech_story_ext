var TongWen = {
    _zh_s: "风章地第我強的大有萬風回金为三开師開个传為书書梦傳明新绝了天里一人局手之鱼起化絕越宝寶异魔異你这已结年結這生神魚东東太個武八长荒从感進從圣始山不种是在世干文斗鬥成長罗反帝羅種小花番完无到布聖被后仙法美日行者穿当下路身诸諸多星们全发們言當飞超發代飛皇龙间間职都终子終職本只空主打十隻与爱愛無與古夢雨唐夜就修破中南剑合上族国龍能劍系和妖月她女青最國火战好家戰猫外白界吃魂老貓水云末求影九可道雲出又心兽来门变王命獸光門黑统來佬学二球變學死宠重寵请戏游統戲点师請點想啊百自四要强红物紅级带灵靈时帶七乐時樂級杀殺快入么麽说海进說真万",
    _zh_t: "盓盠盪盳盽眀眏睧瞜瞣矵砪硂碒碠碦碭碸碽磄磣礘祘祙禐禞禤禪秙秢秼稧稬稲穐竒笉笜筂筣箏箞箤箿篛篜篭篳簘籜籣籶粖糂糉紂紇紺紻絍絭絳絶綗綡綹緋緗緱縁縈縞縹繤繧繬繯纀纃纉纒罙罯羠耮耴聡肍腀腣腨腵膄膪臚舃舦艊艫艭艶芻苅茿荢莂菓菣菳萈葮蒄蒑蒕蓃蓔蓕蓗蔁蔙蔱蕋蕦蕵薃薗藀藵蘌蘓蘔蚾蜠蝨螥衘衟衸袬裺褜褣褸覇覊覯觓訡訮証詇詗誽諂諦謚謡讌讍讜谻豠豧貮貽賅賚賡赲赹赽趝跾踀踃踨踸蹖躉躛躱躻躿軬軻輒輦輽辢酼醕醥醱鈂鈡鉍銌銒銝鋎鋰鍳鎇鎍鎘鎸鏿鐲鐴鐿鑊閔閽陮靄靱鞪韆韟頜顀颩颱飀飥餇饻馿駋駥騿驥驦髉髏鬉鬢鬸魛魺鯩鯬鰌鰻鱌鱺鲓鳶鵏鵨鵼鶓鶩鷵鸓鸖鸘麵黶鼄鼅",

    convert: function (text, direction) {
        var source = direction === "s2t" ? this._zh_s : this._zh_t;
        var target = direction === "s2t" ? this._zh_t : this._zh_s;
        var result = "";

        for (var i = 0; i < text.length; i++) {
            var c = text.charAt(i);
            var idx = source.indexOf(c);
            result += idx !== -1 ? target.charAt(idx) : c;
        }
        return result;
    },

    toSimplified: function (text) {
        return this.convert(text, "t2s");
    },

    toTraditional: function (text) {
        return this.convert(text, "s2t");
    }
};
