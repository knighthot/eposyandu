import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = () => (
  <Svg  width={30} height={30} fill="none">
    <G clipPath="url(#a)">
      <Path
        fill="#FF82AC"
        fillRule="evenodd"
        d="M15 10.625a2.188 2.188 0 1 0 0-4.375 2.188 2.188 0 0 0 0 4.375Zm6.567 2.764a1.251 1.251 0 1 0-.634-2.418c-2.38.624-4.17.903-5.928.896-1.762-.007-3.556-.302-5.952-.9a1.25 1.25 0 0 0-.606 2.425c1.156.29 2.21.518 3.212.682-.197 1.312-1.247 3.474-1.853 4.641a.638.638 0 0 0 .478.927c3.71.47 6.057.482 9.472.007a.632.632 0 0 0 .47-.908c-.59-1.182-1.65-3.42-1.874-4.652a34.632 34.632 0 0 0 3.215-.7Zm-9.692 7.245v2.178a.938.938 0 0 0 1.842.245l.588-2.177a24.35 24.35 0 0 1-2.43-.246Zm4.444.242.588 2.18a.938.938 0 0 0 1.843-.244v-2.187c-.806.122-1.617.206-2.431.25Z"
        clipRule="evenodd"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h30v30H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent
