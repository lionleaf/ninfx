(function(global) {
  class AtmosphereShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.AtmosphereShaderNode = AtmosphereShaderNode;
})(this);
