(function(global) {
  class splishSplosh extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.ground = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50),
                                   new THREE.MeshStandardMaterial());

      const shader = SHADERS["WaterShader"];

      this.water = new THREE.Mesh(new THREE.PlaneGeometry(1, 1,100,100),
                                  new THREE.ShaderMaterial(shader).clone());
      this.uniforms;

      this.water.rotation.x = -3.1415/2.0;
      this.water.position.y = -50;
      this.ground.position.y = -50;
      this.ground.position.z = -100;


      var r = 'https://threejs.org/examples/textures/cube/Bridge2/';
      var urls = [ r + 'posx.jpg', r + 'negx.jpg',
             r + 'posy.jpg', r + 'negy.jpg',
             r + 'posz.jpg', r + 'negz.jpg' ];

      this.textureCube = new THREE.CubeTextureLoader().load( urls );
      this.textureCube.encoding = THREE.sRGBEncoding;
      this.scene.background = this.textureCube;

      this.scene.add(this.ground);
      this.scene.add(this.water);

      var light = new THREE.PointLight(0xffffff, 1, 200);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 100;
    }

    update(frame) {
      super.update(frame);
      
      // Update water uniforms
      this.water.material.uniforms.frame.value = frame;
      this.water.material.uniforms.bottomleft.value = vec3(0,0,0);

      this.ground.rotation.x = Math.sin(frame / 50);
      this.ground.rotation.y = Math.cos(frame / 50);
    }
  }

  global.splishSplosh = splishSplosh;
})(this);
