# 08_codeShin_react+threejs+fiber
- Youtube『[プログラミングチュートリアル](https://www.youtube.com/@user-hl9uv6cv7k)』チャンネルの"react+threejs+fiber"動画を実装してみる
  * refer Youtube : https://www.youtube.com/watch?v=UVZ0UkdKgmY

## 動画実践

### 01．環境構築
- `vite`で開発フォルダ作成
```sh
$ npm create vite@latest 
Need to install the following packages:
  create-vite@4.3.2
Ok to proceed? (y) 
✔ Project name: … r3f-portfolio
✔ Select a framework: › React
✔ Select a variant: › JavaScript
```

- 必要パッケージインストール
```sh
cd r3f-portfolio/
pnpm i
pnpm i three react-three-fiber @react-three/drei -D
```

### 02．初期コードの削除
- `App.jsx`、`App.css`、`index.css`のコードを削除

### 03．Three.jsのコンポーネント実装

- React-Three-Fiberの[ドキュメント](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)参照
  * 単にThreejsをJSXで表現しているだけなので、<mesh />は動的に新しいTHREE.Mesh()に変わります。
  * 新しいThreejsのバージョンが機能を追加、削除、変更した場合、このライブラリのアップデートに依存することなく、即座に利用できるようになります。

#### a. `views/Portfolio.jsx`にBOXを実装
```jsx
// Portfolio.jsx
import { Canvas } from "react-three-fiber";
import "./Portfolio.css";
//
function Portfolio() {
    return (
        <div>
            <Canvas camera={{ fov: 45, near: 0.1, far: 2000 }}>
                <mesh>
                    <boxGeometry />
                    <meshStandardMaterial />
                </mesh>
            </Canvas>
        </div>
    );
}
//
export default Portfolio;
//
```


#### b. `react-three-drei`で`OrbitControl`を追加
- [react-three-drei](https://github.com/pmndrs/drei)（ぢょれい）によりThree.js機能を追加できる
  * `OrbitControl`追加
  * `color`タグをつけると色の指定をできる
```jsx
function Portfolio() {
    return (
        <div>
            <Canvas camera={{ fov: 45, near: 0.1, far: 2000 }}>
                <color args={["#359"]} attach="background" /> 
                <OrbitControls enableDamping />
                <ambientLight />
                <mesh>
                    <boxGeometry />
                    <meshStandardMaterial />
                </mesh>
            </Canvas>
        </div>
    );
}
```

<br>

- 併せて、`index.css`でbodyタグに`margin: 0;`を付けて余白を消す

#### c. Mackbook モデルをダウンロード
- refer site : https://market.pmnd.rs/
  * `Category` > `Technology` > `Mackbook`で選択
  * `Copy direct link` でGLTFへのリンクをコピー：
    * link URL: https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf
- オブジェクトの読込みは、`useGLTF`を理療
  * `primitive`タブでオブジェクトを配置
- 照明`rectAreaLight`を追加
```jsx
function Portfolio() {
    const mackbook = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf");
    // console.log(mackbook);
    return (
        <div>
            <Canvas camera={{ fov: 45, near: 0.1, far: 2000 }}>
                <color args={["#359"]} attach="background" />
                <OrbitControls enableDamping />
                <ambientLight />
                // 照明設定
                <rectAreaLight 
                    color={"#0021a7"}
                    intensity={55}
                    rotation={[0.1, Math.PI, 0]} // Y方向に180度(下に照らす)
                    width={2.0}
                    height={3.65}
                    position={[0, 0, -1]} // [X, Y, Z](奥に-1ずらす)
                />
                // オブジェクトを配置
                <primitive
                    object={mackbook.scene}
                    position={[0, -1.5, 0]} // [X, Y, Z]（下に-1.5に配置）
                >
                </primitive>
            </Canvas>
        </div>
    );
}
```


#### d. 全体の画面回転を制御する
- dreiの`PresentationControls`タグを利用する
  * `OrbitControl`タグを削除
  * `PresentationControls`タグで照明とオブジェクトを囲む
    * refer GitHub : https://github.com/pmndrs/drei#presentationcontrols
    * オブジェクトをマウスクリックして、カーソル動かして回転
    * `global`属性を付けると、画面クリックで回転が有効になる
    * `config`属性で動作の弾性を指定できる
      * `snap`属性を付けると元に戻そうとする
    * `polar`と`azimuth`属性で回転の制限を付ける
  * `Float`タグで自動回転を指示できる
    * refer GitHub : https://github.com/pmndrs/drei#float
    * 回転の度合いは`rotationIntensity`属性で指定できる
```jsx
function Portfolio() {
    const mackbook = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf");
    // console.log(mackbook);
    return (
        <div>
            <Canvas camera={{ fov: 45, near: 0.1, far: 2000 }}>
                <color args={["#359"]} attach="background" />
                <ambientLight />
                <PresentationControls
                    global
                    config={{
                        mass: 5,
                        tension: 300
                    }}
                    snap={{
                        mass: 4,
                        tension: 200
                    }}
                    polar={[0, Math.PI / 2]} // Vertical limits
                    azimuth={[- Math.PI / 2, Math.PI / 2]} // Horizontal limits                  
                >
                    <Float rotationIntensity={1.6}>
                        <rectAreaLight
                            color={"#0021a7"}
                            intensity={55}
                            rotation={[0.1, Math.PI, 0]} // Y方向に180度(下に照らす)
                            width={2.0}
                            height={3.65}
                            position={[0, 0, -1]} // [X, Y, Z](奥に-1ずらす)
                        />
                        <primitive
                            object={mackbook.scene}
                            position={[0, -1.5, 0]} // [X, Y, Z]（下に-1.5に配置）
                        >
                        </primitive>
                    </Float>
                </PresentationControls>
            </Canvas>
        </div>
    );
}
```


#### e. オブジェクトを追加する
- [Market PMND](https://market.pmnd.rs/)からモデルを参照／DLして利用する
  * 追加１：https://market.pmnd.rs/model/cup-tea
    * https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/cup-tea/model.gltf
  * 追加２：https://market.pmnd.rs/model/pen
    * https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/pen/model.gltf
  * DLして利用する場合、`public`フォルダ配下にGLTFファイルを配置する
    - JSXファイルでは、オブジェクトは配置は`PresentaionControl`タグ内に追加
    - オブジェクトを置くだけでは真っ黒なので、`directionalLight`で光を当てる
```jsx
function Portfolio() {
    const mackbook = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf");
    const modelCoffee = useGLTF("./assets/model-cup-tea.gltf");
    const modelPen = useGLTF("./assets/model-pen.gltf");
    return (
        <div>
            <Canvas camera={{ fov: 45, near: 0.1, far: 2000 }}>
                <color args={["#359"]} attach="background" />
                <ambientLight />
                <directionalLight intensity={1.5}/>
                <PresentationControls
                    global
                    ...                  
                >
                    ...
                    <Float rotationIntensity={1.5}>
                        <primitive
                            object={modelCoffee.scene}
                            position-y={-1.0}
                            position-x={-2.4}
                            rotation-x={0.0}
                            // position={[-1, -1.3, 0.2]}
                            scale={[2, 2, 2]}
                        ></primitive>
                    </Float>
                    <Float rotationIntensity={1.5}>
                        <primitive
                            object={modelPen.scene}
                            position-y={-1.0}
                            position-x={2.4}
                            rotation-x={-Math.PI / 2}
                            // position={[-1, -1.3, 0.2]}
                            scale={[1, 1, 1]}
                        ></primitive>
                    </Float>
                </PresentationControls>
            </Canvas>
        </div>
    );
}
```


#### f. テキスト文字を追加する
- dreiの`Text`タブを利用
  * refer GitHub : https://github.com/pmndrs/drei#text
  * `font-size`、位置、回転指定して配置
  * Fontファイルをインポートして利用もできる
    * Robotoフォントを利用
      * refer Google Font : https://fonts.google.com/specimen/Roboto
    * Fontファイルも`public`フォルダ配下に配置する
- 全体をみえるように`Canvas`タグのカメラ位置も調整
```jsx
function Portfolio() {
    ...
    return (
        <div>
            <Canvas
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 2000,
                    position: [0, 1.5, 8],
                }}
            >
                <color args={["#359"]} attach="background" />
                <ambientLight />
                <directionalLight intensity={1.5} />
                <PresentationControls
                    global
                    ...
                >
                    ...
                    <Text
                        font="/assets/RobotoSlab-Bold.ttf"
                        fontSize={0.60}
                        position={[0, 1.725, 0.75]}
                        // maxWidth={3}
                        textAlign="center"
                    >
                        React-Three-Fiber
                    </Text>
                </PresentationControls>
            </Canvas>
        </div>
    );
}
```


#### g. 影を追加
- `ContactShadows`タグでY方向（上下方向）の光の影を付けられる
  * refer GitHub : https://github.com/pmndrs/drei#contactshadows
  * PresentationControlタグの外に追加する
  * オプション　position、opacity, scale, blur(ぼけ)を調整
```jsx
function Portfolio() {
    ...
    return (
        <div>
            <Canvas
                ...
            >
                <color args={["#359"]} attach="background" />
                <ambientLight />
                <directionalLight intensity={1.5} />
                <PresentationControls
                    global
                    ...
                >
                ...
                </PresentationControls>

                <ContactShadows position-y={-2.0} opacity={0.7} scale={7} blur={2.4} />
            </Canvas>
```


#### h. パソコンオンスクリーンに別サイトの表示を加える
- `HTML`タグで`iframe`で別サイトの内容を表示
  * パソコンのスクリーンの位置に合うように調整
  * iframeだけだと画面が小さいので、CSSで調整する
```jsx
function Portfolio() {
    ...
    return (
        <div>
            <Canvas
                ...
            >
                <color args={["#359"]} attach="background" />
                <ambientLight />
                <directionalLight intensity={1.5} />
                <PresentationControls
                    global
                    ...
                >
                    <Float rotationIntensity={1.6}>
                        <rectAreaLight
                            ...
                        />
                        <primitive
                            object={mackbook.scene}
                            position={[0, -1.5, 0]} // [X, Y, Z]（下に-1.5に配置）
                        >
                            <Html
                                wrapperClass="htmlScreen"
                                distanceFactor={1.17}
                                position={[0, 1.56, -1.4]}
                                rotation-x={-0.256}
                                transform
                            >
                                {/* <iframe src="https://shincode-inc-hp.vercel.app/" /> */}
                                <iframe src="https://sgtao.github.io/" />
                            </Html>
                        </primitive>
                    </Float>
```

##### CSSのスタイリング
- `Portfolio.css`ファイルに追記
```css
canvas {
  height: 100vh !important;
}
/* 追加 */
.htmlScreen iframe {
  width: 1024px;
  height: 670px;
  border: none;
  border-radius: 20px;
  background: #000000;
}
```
