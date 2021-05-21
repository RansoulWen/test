const { ccclass, property } = cc._decorator;

@ccclass
export default class RankItem extends cc.Component {

    @property(cc.Label)
    private rankingLabel: cc.Label = null;


    @property(cc.Sprite)
    private ranking1: cc.Sprite = null;

    @property(cc.Sprite)
    private ranking2: cc.Sprite = null;

    @property(cc.Sprite)
    private ranking3: cc.Sprite = null;

    @property(cc.Sprite)
    private avatarSprite: cc.Sprite = null;

    @property(cc.Label)
    private nicknameLabel: cc.Label = null;

    @property(cc.Label)
    private scoreLabel: cc.Label = null;

    /**
     * 设置展示的信息
     * @param ranking 排名
     * @param user 用户数据
     */
    public set(ranking: number, user: UserGameData) {
        this.rankingLabel.string = ranking.toString();
        this.ranking1.node.active = ranking == 1
        this.ranking2.node.active = ranking == 2
        this.ranking3.node.active = ranking == 3
        this.rankingLabel.node.active = ranking > 3
        this.nicknameLabel.string = user.nickname;
        this.scoreLabel.string = user.KVDataList[0].value.toString();
        this.updateAvatar(user.avatarUrl);
    }

    /**
     * 更新头像
     * @param url 头像链接
     */
    private updateAvatar(url: string) {
        let image = wx.createImage();
        image.onload = () => {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            this.avatarSprite.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = url;
    }

}