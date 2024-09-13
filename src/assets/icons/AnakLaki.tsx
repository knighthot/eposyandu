import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = () => (
  <Svg width={30} height={30} fill="none">
    <G clipPath="url(#a)">
      <Path
        fill="#396AFF"
        fillRule="evenodd"
        d="M14.375 10.625a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.148 1.24a1.25 1.25 0 0 1-.895 1.524 32.538 32.538 0 0 1-3.128.673v3.985l.616 4.923a1.25 1.25 0 0 1-2.454.458l-1.25-5a1.25 1.25 0 0 1-.037-.303c0 .102-.012.203-.037.303l-1.25 5a1.25 1.25 0 0 1-2.454-.458l.616-4.923v-4.001a37.684 37.684 0 0 1-3.113-.653 1.25 1.25 0 1 1 .601-2.427c2.274.564 3.975.84 5.642.848 1.664.006 3.36-.256 5.617-.844a1.25 1.25 0 0 1 1.526.895Z"
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
