'use server';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { addUser, findUserByEmail } from '@/app/api/mongoDb';

const JWT_SECRET = 'smartNest2809';

let nextUserId = 2;

export async function POST(request: NextRequest) {
  try {
    console.log("Recibiendo solicitud de registro");
    const body = await request.json();
    console.log("Datos recibidos:", body);
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ 
        success: false, 
        message: 'Se requieren nombre, correo y contraseña' 
      }, { status: 400 });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'Este correo electrónico ya está registrado' 
      }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: nextUserId.toString(),
      name,
      email,
      password: hashedPassword
    };
    nextUserId++;

    await addUser({ newUser });
    console.log("Usuario registrado:", newUser);

    // Crear token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      },
      token
    });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      maxAge: 60 * 60, 
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Error detallado:", error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error del servidor',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}