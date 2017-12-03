import React from 'react';
import {
  Animated,
  AppRegistry,
  asset,
  Model,
  Pano,
  Plane,
  Text,
  Scene,
  View,
  VrButton,
} from 'react-vr';

const AnimatedVrButton = Animated.createAnimatedComponent(VrButton);
const AnimatedModel = Animated.createAnimatedComponent(Model);
const AnimatedScene = Animated.createAnimatedComponent(Scene);

export default class react_vr_dice extends React.Component {
  constructor(props) {
    super(props);
    this.rotateSensitivity = 100;

    this.state = {
      sceneRotateX:  new Animated.Value(0),
      sceneRotateY:  new Animated.Value(0),
      sceneRotating: false,
      viewPostion: { x: 0, y: 0 },
      diceRotateX:  new Animated.Value(0),
      diceRotateZ:  new Animated.Value(0),
    };

    this.onClickStartHandler = this.onClickStartHandler.bind(this);
    this.onInputHandler = this.onInputHandler.bind(this);
    this.resetScene = this.resetScene.bind(this);
  }

  onClickStartHandler() {
    this.resetScene();

    const rotateXNum = Math.floor(Math.random() * 6) + 51;
    const rotateZNum = Math.floor(Math.random() * 6) + 51;
    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.state.diceRotateX, {
          toValue: 90 * rotateXNum,
          delay: 0, // start animation delay, milliseconds
          duration: 5000, // duration of animation, milliseconds
        }),
        Animated.timing(this.state.diceRotateZ, {
          toValue: 90 * rotateZNum,
          delay: 0, // start animation delay, milliseconds
          duration: 5000, // duration of animation, milliseconds
        }),
      ]),
      Animated.timing(this.state.sceneRotateX, {
        toValue: -90,
        delay: 0, // start animation delay, milliseconds
        duration: 3000, // duration of animation, milliseconds
      }),
    ]).start();
  }

  onInputHandler(e) {
    const inputEvent = e.nativeEvent.inputEvent;
    if (inputEvent.type === 'MouseInputEvent' && inputEvent.shiftKey) {
      if (this.state.sceneRotating) {
        const degX = (inputEvent.viewportY - this.state.viewPostion.y) * this.rotateSensitivity;
        this.rotateSceneX(degX);
        const degY = -(inputEvent.viewportX - this.state.viewPostion.x) * this.rotateSensitivity;
        this.rotateSceneY(degY);
      }
      this.setState({
        sceneRotating: true,
        viewPostion: { x: inputEvent.viewportX, y: inputEvent.viewportY },
      });
    } else if (this.state.sceneRotating) {
      this.setState({ sceneRotating: false });
    }
  }

  resetScene() {
    this.setState({
      sceneRotating: false,
      viewPostion: { x: 0, y: 0 },
    });
    this.state.sceneRotateX.setValue(0);
    this.state.sceneRotateY.setValue(0);
    this.state.diceRotateX.setValue(0);
    this.state.diceRotateZ.setValue(0);
  }

  rotateSceneX(deg) {
    const newRotate = Math.min(
      Math.max(this.state.sceneRotateX._value + deg, -180),
      0);
    this.state.sceneRotateX.setValue(newRotate);
  }

  rotateSceneY(deg) {
    this.state.sceneRotateY.setValue(this.state.sceneRotateY._value + deg);
  }

  sceneTransform() {
    return [
      { rotateX: this.state.sceneRotateX },
      { rotateY: this.state.sceneRotateY },
      { translate: [0, 0, 10] },
    ];
  }

  render() {
    return (
      <View onInput={this.onInputHandler} >
        <Pano source={asset('chess-world.jpg')} />
        <AnimatedScene style={{ transform: this.sceneTransform() }} />
        <AnimatedModel
          source={{
            obj: asset('dice.obj'),
            mtl: asset('dice.mtl'),
          }}
          style={{
            transform: [
              { rotateX: this.state.diceRotateX },
              { rotateZ: this.state.diceRotateZ },
              { scale: 0.5 },
            ],
          }}
        />
        <AnimatedVrButton
          style={{
            backgroundColor: 'blue',
            transform: [...this.sceneTransform(), { translate: [2, 2, -5] }],
          }}
          onClick={this.onClickStartHandler}
        >
          <Text style={{ fontSize: 0.5 }} >
            START
          </Text>
        </AnimatedVrButton>
        <AnimatedVrButton
          style={{
            backgroundColor: 'blue',
            transform: [...this.sceneTransform(), { translate: [2, 1, -5] }],
          }}
          onClick={this.resetScene}
        >
          <Text style={{ fontSize: 0.5 }} >
            RESET
          </Text>
        </AnimatedVrButton>
        <Plane
          dimWidth={50}
          dimHeight={50}
          style={{
            color: 'green',
            transform: [
              { translateY: -0.5 },
              { rotateX: -90 },
            ],
          }}
        />
      </View>
    );
  }
}

AppRegistry.registerComponent('react_vr_dice', () => react_vr_dice);
