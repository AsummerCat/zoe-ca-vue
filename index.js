import caSignature from './src/components/caSignature'
import _Vue from 'vue'

caSignature.install = Vue => {
  if (!Vue) {
    window.Vue = Vue = _Vue
  }
  caSignature.component(caSignature.name, caSignature)
}
export default caSignature;
