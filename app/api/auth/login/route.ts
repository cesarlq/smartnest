'use server';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '@/app/api/mongoDb';

const JWT_SECRET = 'smartNest2809';

export async function POST(request: NextRequest) {
  try {
    console.log("Recibiendo solicitud de login");
    const body = await request.json();
    console.log("Datos recibidos:", body);
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        message: 'Se requieren correo y contraseña' 
      }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      }, { status: 401 });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = NextResponse.json({
      success: true,
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
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