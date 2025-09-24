var TongWen = {
    _zh_s: "万与丑专业丛东丝丢两严丧个丬丰临为丽举么义乌乐乔习乡书买乱争于亏云亘亚亩亲亵亸亿仅从仑仓仪们价众优伙会伛伞伟传伤伥伦伧伪伫体余佣佥侠侣侥侦侧侨侩侪侬俣俦俨俩俪俫俭修俯俱",
    _zh_t: "萬與醜專業叢東絲丟兩嚴喪個爿豐臨為麗舉麼義烏樂喬習鄉書買亂爭於虧雲亙亞畝親褻嚲億僅從侖倉儀們價眾優夥會傴傘偉傳傷倀倫傖偽佇體餘傭僉俠侶僥偵側僑儈儕儂俁儔儼倆儷㑮儉修俯俱",

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