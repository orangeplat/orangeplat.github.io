# Web mic
 
 ブラウザでアクセスするだけでスマートフォンがマイク代わりになるシステム。
 
## 概要
 
WebRTC (SkyWay) を使って特別なアプリをインストールすることなく通話を実現する。<br>
下記サイトにスマホからアクセスすると喋った音声がラズパイから出力される!<br>
複数のスマホを同時に接続も可能。

 https://onthesun.github.io/host/
 <div align="center">
 <img src="https://onthesun.github.io/images/WebMicQR.gif" width=50%>
 </div>

## 動作説明
 
1. Web Server から Web アプリをロード
2. SkyWay のシグナリングサーバと接続
3. SkyWay サーバを経由して（SFU モード）スマホからラズパイへオーディオストリームを流す

<div align="center">
<img src="https://onthesun.github.io/images/WebMic.png" width=100%>
</div>

確認した環境だと Audio は Opus 48kHz になった

## Requirement

 * Raspberry Pi にインストールしたソフト（全部必要か不明）
   * npm 6.13.4
   * node v12.14.0
   * chromium (既にある場合は不要)

 * 確認環境
   * Raspberry Pi 3 Model B
     * Linux ontheyopi 4.19.66-v7+ #1253 SMP Thu Aug 15 11:49:46 BST 2019 armv7l GNU/Linux
     * Chromium 72.0.3626.121（Official Build）Built on Raspbian , running on Raspbian 9.11 （32 ビット）
   * iPhone X
     * iOS 13.3
     * Safari

## Installation

* Raspberry Pi
  * 下記のようにインストール
    ```bash
    sudo apt-get update
    sudo apt-get install -y nodejs npm
    sudo npm cache clean
    sudo npm install npm n -g
    sudo n stable
    sudo apt-get install -y rpi-chromium-mods  # 未確認
    ```

  * 起動時にデスクトップを表示するよう設定
    * raspi-config で設定する (動作未確認)
       ```
       sudo raspi-config
         -> 3 Enable Boot to Desktop/Scratch
           -> Desktop Log in as user ‘pi’ at the graphical desktop
       ```

  * 起動時にブラウザを起動するよう設定
    1. /etc/systemd/system/open-browser.service を作成、編集
       ```
       [Unit]
       Description=launch chromium-browser
       
       [Service]
       User=pi
       Environment=DISPLAY=:0
       ExecStart=/usr/bin/chromium-browser https://onthesun.github.io/mixer/
       
       [Install]
       WantedBy=user@.service
       ```
    2. 下記を実行
       ```
       sudo systemctl daemon-reload
       sudo systemctl enable open-browser.service
       sudo systemctl start open-browser.service
       ```
  * プロキシ設定
    * chromium に拡張機能「Proxy SwitchyOmega」をインストール
      * chrome ウェブストアから Proxy SwitchyOmega をインストールする
      * プロキシを設定して適用
      * この拡張機能を使えば簡単にプロキシ設定を ON/OFF できる

* SkyWay
  * アカウント作成
    * https://console-webrtc-free.ecl.ntt.com/users/registration
  * アプリケーション作成
    * https://console-webrtc-free.ecl.ntt.com/add
      * 利用可能なドメインには Web アプリをホスティングするドメインを入力
        * このリポジトリを使う場合は onthesun.github.io
      * 権限は変更なしでよい
        * TURNを利用する
        * SFUを利用する
        * listAllPeers APIを利用する
    * 作成したら API キーを Host 側、Mixer 側 両方の script.js に反映する

* WebServer
  * Web アプリをホスティングする (このリポジトリでよければ何もする必要はない)
    * https じゃないとダメかも (未確認)
    * スマホで host 側にアクセス
    * ラズパイで mixer 側にアクセス

## Usage
 
* ラズパイ
  * 起動するだけ (起動には 2~3 分かかる ?)
     * → 自動的に chromium が起動し、Mixer 側の Web アプリが立ち上がる
     * 初回のアクセス時はマイクのアクセス許可を手動で行う必要がある
* スマホ
  * ブラウザで Host にアクセスするだけ
     * → ラズパイと繋がり、スマホで話した声がラズパイから出力される
 
## Note
 
* WebAudio でハウリング対策をしてみたものの効果は不明
  * 遅延が大きくなっているかもしれないので切ったほうが良いかも
 
## Author
 
作成情報を列挙する
 
* 作成者
* 所属
* E-mail
 
## License
ライセンスを明示する
 
"hoge" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).
 
社内向けなら社外秘であることを明示してる
 
"hoge" is Confidential.

