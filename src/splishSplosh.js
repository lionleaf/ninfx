(function(global) {
  class splishSplosh extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: new THREE.PerspectiveCamera(45, 16/9, 0.1, 1000),
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.ground = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50),
                                   new THREE.MeshStandardMaterial());

      const shader = SHADERS["WaterShader"];

      // Water plane is the XZ plane, used for culling calculations
      this.waterPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
      let mat = new THREE.ShaderMaterial(shader)
      //mat.wireframe = true;
      this.water = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100,400),
                                  mat.clone());
      this.water.frustumCulled = false; //Never cull this, as the position is calculated in shader



      this.ground.position.y = -50;
      this.ground.position.z = -100;


      var r = 'https://threejs.org/examples/textures/cube/Bridge2/';
      var urls = [ r + 'posx.jpg', r + 'negx.jpg',
             r + 'posy.jpg', r + 'negy.jpg',
             r + 'posz.jpg', r + 'negz.jpg' ];

      this.textureCube = new THREE.CubeTextureLoader().load( urls );
      this.textureCube.encoding = THREE.sRGBEncoding;
      //this.scene.background = this.textureCube;

      this.scene.add(this.ground);
      this.scene.add(this.water);

      var light = new THREE.PointLight(0xffffff, 1, 200);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 50;
      this.camera.position.y = 1050;
      this.camera.rotation.x = -0.09;
      this.camera.updateProjectionMatrix();
      this.camera.updateMatrixWorld();
    }

    calcFrustumSeaIntersection(seaPlane){
      this.camera.updateProjectionMatrix();
      // Calculate water plane intersection with view frustum
      let PVinv = this.camera.projectionMatrixInverse.premultiply(this.camera.matrixWorld);

      let nearTopLeft = (new THREE.Vector3(-1,1,-1)).applyMatrix4(PVinv);
      let nearTopRight = (new THREE.Vector3(1,1,-1)).applyMatrix4(PVinv);
      let nearBottomRight = (new THREE.Vector3(1,-1,-1)).applyMatrix4(PVinv);
      let nearBottomLeft = (new THREE.Vector3(-1,-1,-1)).applyMatrix4(PVinv);

      let farTopLeft = (new THREE.Vector3(-1,1,1)).applyMatrix4(PVinv);
      let farTopRight = (new THREE.Vector3(1,1,1)).applyMatrix4(PVinv);
      let farBottomRight = (new THREE.Vector3(1,-1,1)).applyMatrix4(PVinv);
      let farBottomLeft = (new THREE.Vector3(-1,-1,1)).applyMatrix4(PVinv);

      /*console.log("Far top left: " + farTopLeft);
      console.log( farTopLeft);
      console.log("Far bottom right: " + farBottomRight);
      console.log( farBottomRight);
      console.log("Near top left: " + nearTopLeft);
      console.log( nearTopLeft);
      console.log("Near bottom right: " + nearBottomRight);
      console.log( nearBottomRight);*/

      let linesOfInterest = [
        new THREE.Line3(nearTopLeft, farTopLeft),
        new THREE.Line3(nearTopRight, farTopRight),
        new THREE.Line3(nearBottomRight, farBottomRight),
        new THREE.Line3(nearBottomLeft, farBottomLeft),

        new THREE.Line3(farTopLeft, farTopRight),
        new THREE.Line3(farTopRight, farBottomRight),
        new THREE.Line3(farBottomRight, farBottomLeft),
        new THREE.Line3(farBottomLeft, farTopLeft)
      ]



      //TODO: This need to be generalized for rotation etc
      // Maybe find the 4 intersection points among all lines and sort them after?
      
      let intersectPoint = new THREE.Vector3();
      let nearLeft = seaPlane.intersectLine(linesOfInterest[3], intersectPoint);;

      //nearLeft.x += 2000;
      console.log(nearLeft);
      if(nearLeft === undefined){
        console.log(":(");
        console.log(linesOfInterest[3]);
        console.log(seaPlane);
        console.log(intersectPoint);
        nearLeft = [-20, 0, 0]
      }

      intersectPoint = new THREE.Vector3();
      let nearRight= seaPlane.intersectLine(linesOfInterest[2], intersectPoint);;
      if(nearRight === undefined){
        console.log(":(");
        nearRight = [20, 0, 0]
      }

      intersectPoint = new THREE.Vector3();
      let farLeft= seaPlane.intersectLine(linesOfInterest[7], intersectPoint);;
      if(farLeft === undefined){
        console.log(":(");
        farLeft = [-1000, 0, -1000]
      }

      intersectPoint = new THREE.Vector3();
      let farRight= seaPlane.intersectLine(linesOfInterest[5], intersectPoint);;
      if(farRight === undefined){
        console.log(":(");
        farRight = [1000, 0, -1000]
      }


      //console.log([nearLeft, nearRight, farRight, farLeft]);


  
      return [nearLeft, nearRight, farRight, farLeft];

    }

    update(frame) {
      super.update(frame);

      let intersections = this.calcFrustumSeaIntersection(this.waterPlane);

      this.water.material.uniforms.nearLeft.value = intersections[0];
      this.water.material.uniforms.nearRight.value = intersections[1];
      this.water.material.uniforms.farRight.value  = intersections[2];
      this.water.material.uniforms.farLeft.value   = intersections[3];
      
      // Update water uniforms
      this.water.material.uniforms.frame.value = frame;


      this.ground.rotation.x = Math.sin(frame / 50);
      this.ground.rotation.y = Math.cos(frame / 50);
    }
  }

  global.splishSplosh = splishSplosh;
})(this);
