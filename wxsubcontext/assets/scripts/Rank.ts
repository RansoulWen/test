import RankItem from "./RankItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rank extends cc.Component {

    @property(cc.Node)
    private content: cc.Node = null;

    @property(cc.Prefab)
    private itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    private loading: cc.Node = null;

    protected onLoad() {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME_SUB) return;
        // 监听来自主域的消息
        wx.onMessage((msg: any) => this.onMessage(msg));
    }

    /**
     * 消息回调
     * @param msg 消息
     */
    private onMessage(msg: any) {
        switch (msg.event) {
            case 'setScore':
                this.setScore(msg.score);
                break;
            case 'getRank':
                this.getRank();
                break;
        }
    }

    /**
     * 获取玩家分数
     */
    private getScore(): Promise<number> {
        return new Promise(resolve => {
            console.log('[getScore]');
            wx.getUserCloudStorage({
                keyList: ['score'],
                success: (res: UserGameData) => {
                    console.log('[getScore]', 'success', res);
                    resolve(res.KVDataList[0] ? parseInt(res.KVDataList[0].value) : 0);
                },
                fail: () => {
                    console.log('[getScore]', 'fail');
                    resolve(-1);
                }
            });
        });
    }

    /**
     * 设置玩家分数
     * @param value 分数
     */
    private async setScore(value: number) {
        console.log('[setScore]', value);
        // let oldScore = await this.getScore();
        // if (oldScore === -1) return;
        if (value >= 0) {
            wx.setUserCloudStorage({
                KVDataList: [{
                    key: 'score',
                    value: value.toString()
                }],
                success: () => {
                    console.log('[setScore]', 'success');
                },
                fail: () => {
                    console.log('[setScore]', 'fail');
                }
            });
        }
    }

    /**
     * 获取排行榜
     */
    private async getRank() {
        console.log('[getRank]');
        // 显示加载动画
        this.showLoading();
        // 调用微信的函数
        await new Promise(resolve => {
            wx.getFriendCloudStorage({
                keyList: ['score'],
                success: (res: any) => {
                    console.log('[getRank]', 'success', res);
                    // 对数据进行排序
                    res.data.sort((a: UserGameData, b: UserGameData) => {
                        if (a.KVDataList.length === 0 && b.KVDataList.length === 0) return 0;
                        if (a.KVDataList.length === 0) return 1;
                        if (b.KVDataList.length === 0) return -1;
                        return parseInt(b.KVDataList[0].value) - parseInt(a.KVDataList[0].value);
                    });
                    // 排序之后进行展示
                    this.updateRankList(res.data);
                    resolve(-1);
                },
                fail: (res: any) => {
                    console.log('[getRank]', 'fail');
                    resolve(-1);
                }
            });
        });
        // 关闭加载动画
        this.hideLoading();
    }

    /**
     * 更新好友排行
     * @param data 数据
     */
    private updateRankList(data: UserGameData[]) {
        let children = this.content.children;
        let length = children.length;
        for (let i = 0; i < length; i++) {
            children[i].destroy ();
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i]) {
                 let node = cc.instantiate(this.itemPrefab);
                 node.setParent(this.content);
                 node.getComponent(RankItem).set(i + 1, data[i]);
            }
        }
    }

    /**
     * 显示加载动画
     */
    private showLoading() {
        this.loading.active = true;
    }

    /**
     * 关闭加载动画
     */
    private hideLoading() {
        this.loading.active = false;
    }

}
