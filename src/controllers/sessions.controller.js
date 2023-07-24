import { createHash, validatePassword } from "../utils.js";
import usersModel from "../dao/models/users.model.js";
import {CreateCurrentUserDto, GetCurrentUserDto} from "../dao/dto/user.dto.js"


const sessionsController = {};

// Crear cuenta
sessionsController.singup = (req, res) =>{
  
  req.session.user = {
    first_name : req.user.first_name,
    last_name: req.user.last_name,
    age: req.user.age,
    email: req.user.email,
    role: req.user.role
  };

  res.send({status:"succes", message:"User registered"});
  req.logger.info("Usuario registrado con éxito");
}

// Error al crear cuenta
sessionsController.failsignup = async (req,res)=>{
  req.logger.warn("Fallo en el registro");
  res.send({error: 'Error en el registro'})
}

// Iniciar sesión
sessionsController.signin = (req,res)=>{

  if(!req.user) return res.status(400).send({status:"error", error: 'Invalid credentials'});
  
  req.session.user = {
    first_name : req.user.first_name,
    last_name: req.user.last_name,
    age: req.user.age,
    email: req.user.email,
    role: req.user.role
  };

  res.send({status:"success", payload:req.user, message:"Bienvenido a Pets"})
  req.logger.info("Un usuario ha iniciado sesión");
};

// Error al iniciar sesión
sessionsController.failsignin = async (req,res)=>{
  req.logger.warn("Fallo en el ingreso");
  res.send({error: "Error en el ingreso"})
};

// Hacemos un reseteo del password
sessionsController.resetpassword = async (req, res)=>{
  const {email, password } = req.body;
  
  if(!email || !password ) return res.status(400).send({status:"error", error:"Datos incorrectos"})

  const user = await usersModel.findOne({email});
  if(!user) return res.status(400).send({status:"error", error:"Datos incorrectos"})
  
  const newHashedPassword = createHash(password);

  await usersModel.updateOne({_id:user._id},{$set:{password:newHashedPassword}});

  req.logger.info("Se ha actualizado la contraseña de usuario");
  res.send({status:"success", message:"Contraseña actualizada"})
};

// Se registra con GitHub
sessionsController.github = async (req,res)=>{}; 

sessionsController.githubcallback = async (req,res)=>{
  req.session.user = await req.user;
  res.redirect("/profile")
};

// Destruye la sesión
sessionsController.logout = async (req, res, next) => {
  await req.session.destroy((err) => {
    if (err) return next(err);
    req.logger.info("Se ha cerrado la sesión del usuario");
    res.redirect("/signin");
  });
};

// Muestra el perfil del usuario actualmente logueado
sessionsController.current = (req, res) =>  {
  let{ first_name,last_name,email, role} = req.session.user
  let newUser = new CreateCurrentUserDto({first_name,last_name, email, role})
  let user = new GetCurrentUserDto(newUser)
  res.send(user)
};


export default sessionsController;