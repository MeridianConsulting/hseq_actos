#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de migración de datos desde Excel hacia archivo SQL HSEQ
Autor: Sistema HSEQ
Fecha: 2025
"""

import pandas as pd
import sys
import os
from datetime import datetime
import logging

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('migracion_hseq.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

class MigracionHSEQ:
    def __init__(self):
        """
        Inicializar el migrador
        """
        self.usuarios_procesados = []
        self.errores = []
        self.usuarios_existentes = set()  # Para evitar duplicados
        
    def cargar_usuarios_existentes(self, archivo_hseq_existente):
        """
        Cargar usuarios existentes desde el archivo hseq.sql para evitar duplicados
        """
        try:
            if not os.path.exists(archivo_hseq_existente):
                logging.warning(f"Archivo {archivo_hseq_existente} no encontrado. No se pueden verificar duplicados.")
                return
            
            with open(archivo_hseq_existente, 'r', encoding='utf-8') as f:
                contenido = f.read()
            
            # Buscar INSERT statements existentes
            import re
            # Patrón para encontrar emails en INSERT statements
            patron = r"INSERT INTO `usuarios`[^)]*'([^']*@[^']*)'"
            emails_existentes = re.findall(patron, contenido)
            
            # Patrón para encontrar cédulas en INSERT statements
            patron_cedula = r"INSERT INTO `usuarios`[^)]*'(\d{8,12})'"
            cedulas_existentes = re.findall(patron_cedula, contenido)
            
            self.usuarios_existentes = set(emails_existentes + cedulas_existentes)
            logging.info(f"Usuarios existentes cargados: {len(self.usuarios_existentes)} emails/cédulas")
            
        except Exception as e:
            logging.error(f"Error cargando usuarios existentes: {e}")
    
    def validar_cedula(self, cedula):
        """
        Validar formato de cédula colombiana
        """
        if pd.isna(cedula) or cedula == '':
            return False
        
        # Convertir a string y limpiar
        cedula_str = str(cedula).strip()
        
        # Verificar que solo contenga números
        if not cedula_str.isdigit():
            return False
        
        # Verificar longitud (entre 8 y 12 dígitos)
        if len(cedula_str) < 8 or len(cedula_str) > 12:
            return False
        
        return True
    
    def validar_email(self, email):
        """
        Validar formato de email
        """
        if pd.isna(email) or email == '':
            return False
        
        email_str = str(email).strip().lower()
        
        # Validación básica de email
        if '@' not in email_str or '.' not in email_str:
            return False
        
        # Verificar que no tenga espacios
        if ' ' in email_str:
            return False
        
        # Verificar que no sea "No tiene correo electrónico"
        if 'no tiene correo' in email_str:
            return False
        
        return True
    
    def obtener_email_prioritario(self, row):
        """
        Obtener el email prioritario: primero corporativo, luego personal
        """
        email_corporativo = None
        email_personal = None
        
        # Buscar correo corporativo (Columna E)
        if 'Correo Corporativo' in row.index and not pd.isna(row['Correo Corporativo']) and str(row['Correo Corporativo']).strip() != '':
            email_valor = str(row['Correo Corporativo']).strip().lower()
            if self.validar_email(email_valor):
                email_corporativo = email_valor
        
        # Buscar correo personal (Columna D)
        if 'Correo Electrónico' in row.index and not pd.isna(row['Correo Electrónico']) and str(row['Correo Electrónico']).strip() != '':
            email_valor = str(row['Correo Electrónico']).strip().lower()
            if self.validar_email(email_valor):
                email_personal = email_valor
        
        # Retornar el prioritario
        if email_corporativo:
            return email_corporativo
        elif email_personal:
            return email_personal
        else:
            return None
    
    def limpiar_nombre(self, nombre):
        """
        Limpiar y formatear el nombre
        """
        if pd.isna(nombre) or nombre == '':
            return None
        
        nombre_str = str(nombre).strip()
        
        # Capitalizar palabras
        nombre_limpio = ' '.join(word.capitalize() for word in nombre_str.split())
        
        return nombre_limpio
    
    def escapar_sql(self, valor):
        """
        Escapar caracteres especiales para SQL
        """
        if valor is None:
            return 'NULL'
        
        valor_str = str(valor)
        # Escapar comillas simples
        valor_escapado = valor_str.replace("'", "''")
        return f"'{valor_escapado}'"
    
    def usuario_existe(self, cedula, email):
        """
        Verificar si el usuario ya existe en la base de datos
        """
        return cedula in self.usuarios_existentes or email in self.usuarios_existentes
    
    def procesar_excel(self, archivo_excel):
        """
        Procesar el archivo Excel y extraer datos de usuarios
        """
        try:
            logging.info(f"Leyendo archivo Excel: {archivo_excel}")
            
            # Leer el archivo Excel
            df = pd.read_excel(archivo_excel)
            
            logging.info(f"Archivo leído exitosamente. Filas encontradas: {len(df)}")
            logging.info(f"Columnas disponibles: {list(df.columns)}")
            
            # Mostrar las primeras filas para verificar estructura
            logging.info("Primeras 3 filas del archivo:")
            for i, row in df.head(3).iterrows():
                logging.info(f"Fila {i+1}: {dict(row)}")
            
            usuarios_procesados = []
            errores = []
            usuarios_duplicados = []
            
            for index, row in df.iterrows():
                try:
                    # Obtener datos básicos según la estructura del Excel
                    # Columna A: No. Identificacion -> cedula
                    cedula = str(row.get('No. Identificacion', '')).strip()
                    
                    # Columna B: Nombres y Apellidos -> nombre
                    nombre = self.limpiar_nombre(row.get('Nombres y Apellidos', ''))
                    
                    # Columna C: Proyecto -> proyecto
                    proyecto = str(row.get('Proyecto', '3047761-4')).strip()
                    
                    # Columnas D y E: Correo Electrónico y Correo Corporativo
                    email = self.obtener_email_prioritario(row)
                    
                    # Validaciones
                    if not nombre:
                        errores.append(f"Fila {index+1}: Nombre vacío o inválido")
                        continue
                    
                    if not self.validar_cedula(cedula):
                        errores.append(f"Fila {index+1}: Cédula inválida: {cedula}")
                        continue
                    
                    if not email:
                        errores.append(f"Fila {index+1}: No se encontró email válido")
                        continue
                    
                    # Verificar si el usuario ya existe
                    if self.usuario_existe(cedula, email):
                        usuarios_duplicados.append({
                            'nombre': nombre,
                            'cedula': cedula,
                            'correo': email,
                            'fila': index + 1
                        })
                        logging.warning(f"Usuario duplicado encontrado: {nombre} - {email} (Fila {index+1})")
                        continue
                    
                    # Crear objeto usuario
                    usuario = {
                        'nombre': nombre,
                        'cedula': cedula,
                        'correo': email,
                        'contrasena': cedula,  # Contraseña igual a cédula
                        'rol': 'colaborador',
                        'proyecto': proyecto,
                        'activo': 1
                    }
                    
                    usuarios_procesados.append(usuario)
                    logging.info(f"Usuario procesado: {nombre} - {email}")
                    
                except Exception as e:
                    errores.append(f"Fila {index+1}: Error procesando datos - {str(e)}")
                    continue
            
            logging.info(f"Procesamiento completado. Usuarios válidos: {len(usuarios_procesados)}")
            logging.info(f"Usuarios duplicados: {len(usuarios_duplicados)}")
            logging.info(f"Errores encontrados: {len(errores)}")
            
            if usuarios_duplicados:
                logging.warning("Usuarios duplicados encontrados:")
                for dup in usuarios_duplicados:
                    logging.warning(f"  - {dup['nombre']} ({dup['correo']}) - Fila {dup['fila']}")
            
            if errores:
                logging.warning("Errores durante el procesamiento:")
                for error in errores:
                    logging.warning(f"  - {error}")
            
            return usuarios_procesados, errores, usuarios_duplicados
            
        except Exception as e:
            logging.error(f"Error leyendo archivo Excel: {e}")
            return [], [f"Error fatal: {str(e)}"], []
    
    def generar_sql(self, usuarios, archivo_sql_salida):
        """
        Generar archivo SQL con INSERT statements usando INSERT IGNORE para evitar duplicados
        """
        try:
            with open(archivo_sql_salida, 'w', encoding='utf-8') as f:
                # Escribir encabezado del archivo SQL
                f.write("-- Script de migración de usuarios HSEQ\n")
                f.write(f"-- Generado automáticamente el: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"-- Total de usuarios: {len(usuarios)}\n")
                f.write("-- Usando INSERT IGNORE para evitar duplicados\n")
                f.write("--\n\n")
                
                # Escribir INSERT statements con IGNORE
                for i, usuario in enumerate(usuarios, 1):
                    sql_insert = f"""INSERT IGNORE INTO `usuarios` (`nombre`, `cedula`, `correo`, `contrasena`, `rol`, `Proyecto`, `activo`, `creado_en`) VALUES (
    {self.escapar_sql(usuario['nombre'])},
    {self.escapar_sql(usuario['cedula'])},
    {self.escapar_sql(usuario['correo'])},
    {self.escapar_sql(usuario['contrasena'])},
    {self.escapar_sql(usuario['rol'])},
    {self.escapar_sql(usuario['proyecto'])},
    {usuario['activo']},
    {self.escapar_sql(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))}
);\n"""
                    
                    f.write(sql_insert)
                    
                    # Agregar comentario cada 10 registros
                    if i % 10 == 0:
                        f.write(f"-- Procesados {i} usuarios...\n\n")
                
                # Escribir comentario final
                f.write(f"\n-- Migración completada. Total de usuarios insertados: {len(usuarios)}\n")
                f.write(f"-- Fecha de finalización: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write("-- Nota: INSERT IGNORE ignorará automáticamente los registros duplicados\n")
            
            logging.info(f"Archivo SQL generado exitosamente: {archivo_sql_salida}")
            return True
            
        except Exception as e:
            logging.error(f"Error generando archivo SQL: {e}")
            return False
    
    def unir_con_hseq_existente(self, archivo_sql_nuevo, archivo_hseq_existente, archivo_salida):
        """
        Unir el nuevo SQL con el archivo hseq.sql existente
        """
        try:
            # Leer el archivo hseq.sql existente
            with open(archivo_hseq_existente, 'r', encoding='utf-8') as f:
                contenido_existente = f.read()
            
            # Leer el archivo SQL nuevo
            with open(archivo_sql_nuevo, 'r', encoding='utf-8') as f:
                contenido_nuevo = f.read()
            
            # Crear el archivo unificado
            with open(archivo_salida, 'w', encoding='utf-8') as f:
                # Escribir contenido existente
                f.write(contenido_existente)
                
                # Agregar separador
                f.write("\n\n-- ===========================================\n")
                f.write("-- USUARIOS MIGRADOS DESDE EXCEL\n")
                f.write(f"-- Fecha de migración: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write("-- ===========================================\n\n")
                
                # Agregar contenido nuevo
                f.write(contenido_nuevo)
            
            logging.info(f"Archivo unificado generado: {archivo_salida}")
            return True
            
        except Exception as e:
            logging.error(f"Error uniendo archivos SQL: {e}")
            return False
    
    def migrar_usuarios(self, archivo_excel, archivo_sql_salida, unir_con_existente=False, archivo_hseq_existente=None):
        """
        Función principal para migrar usuarios desde Excel a SQL
        """
        try:
            # Cargar usuarios existentes si se proporciona el archivo
            if archivo_hseq_existente and os.path.exists(archivo_hseq_existente):
                print("Cargando usuarios existentes para evitar duplicados...")
                self.cargar_usuarios_existentes(archivo_hseq_existente)
            
            # Procesar archivo Excel
            usuarios, errores, duplicados = self.procesar_excel(archivo_excel)
            
            if not usuarios:
                logging.error("No se encontraron usuarios válidos para migrar")
                return False
            
            # Confirmar migración
            print(f"\n{'='*60}")
            print(f"RESUMEN DE MIGRACIÓN")
            print(f"{'='*60}")
            print(f"Usuarios a migrar: {len(usuarios)}")
            print(f"Usuarios duplicados (omitidos): {len(duplicados)}")
            print(f"Errores encontrados: {len(errores)}")
            print(f"Archivo SQL de salida: {archivo_sql_salida}")
            print(f"\nPrimeros 5 usuarios a migrar:")
            for i, usuario in enumerate(usuarios[:5]):
                print(f"  {i+1}. {usuario['nombre']} - {usuario['correo']} - {usuario['cedula']}")
            
            if len(usuarios) > 5:
                print(f"  ... y {len(usuarios) - 5} usuarios más")
            
            if duplicados:
                print(f"\nUsuarios duplicados (se omitirán):")
                for i, dup in enumerate(duplicados[:3]):
                    print(f"  {i+1}. {dup['nombre']} - {dup['correo']}")
                if len(duplicados) > 3:
                    print(f"  ... y {len(duplicados) - 3} usuarios duplicados más")
            
            confirmacion = input(f"\n¿Desea continuar con la migración? (s/n): ").lower().strip()
            
            if confirmacion not in ['s', 'si', 'sí', 'y', 'yes']:
                logging.info("Migración cancelada por el usuario")
                return False
            
            # Generar archivo SQL
            print(f"\nGenerando archivo SQL...")
            if not self.generar_sql(usuarios, archivo_sql_salida):
                return False
            
            # Si se solicita unir con archivo existente
            if unir_con_existente and archivo_hseq_existente:
                if os.path.exists(archivo_hseq_existente):
                    archivo_unificado = f"hseq_completo_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"
                    print(f"Uniendo con archivo existente...")
                    if self.unir_con_hseq_existente(archivo_sql_salida, archivo_hseq_existente, archivo_unificado):
                        print(f"Archivo unificado generado: {archivo_unificado}")
                    else:
                        print("Error al unir archivos")
                else:
                    print(f"Archivo {archivo_hseq_existente} no encontrado")
            
            # Resumen final
            print(f"\n{'='*60}")
            print(f"MIGRACIÓN COMPLETADA")
            print(f"{'='*60}")
            print(f"Usuarios procesados: {len(usuarios)}")
            print(f"Usuarios duplicados: {len(duplicados)}")
            print(f"Errores encontrados: {len(errores)}")
            print(f"Archivo SQL generado: {archivo_sql_salida}")
            
            if errores:
                print(f"\nErrores de procesamiento:")
                for error in errores:
                    print(f"  - {error}")
            
            logging.info(f"Migración completada. Usuarios: {len(usuarios)}, Duplicados: {len(duplicados)}, Errores: {len(errores)}")
            return True
            
        except Exception as e:
            logging.error(f"Error durante la migración: {e}")
            return False

def main():
    """
    Función principal del script
    """
    print("="*60)
    print("MIGRADOR DE DATOS EXCEL A SQL HSEQ")
    print("="*60)
    
    # Archivo Excel
    archivo_excel = input("\nRuta del archivo Excel (default: todos.xlsx): ").strip() or 'todos.xlsx'
    
    if not os.path.exists(archivo_excel):
        print(f"Error: El archivo {archivo_excel} no existe")
        return
    
    # Archivo SQL de salida
    archivo_sql_salida = input("\nNombre del archivo SQL de salida (default: usuarios_migrados.sql): ").strip() or 'usuarios_migrados.sql'
    
    # Preguntar si unir con archivo existente
    unir_con_existente = input("\n¿Desea unir con el archivo hseq.sql existente? (s/n): ").lower().strip() in ['s', 'si', 'sí', 'y', 'yes']
    
    archivo_hseq_existente = None
    if unir_con_existente:
        archivo_hseq_existente = input("Ruta del archivo hseq.sql existente (default: hseq.sql): ").strip() or 'hseq.sql'
    else:
        # Preguntar si quiere verificar duplicados
        verificar_duplicados = input("\n¿Desea verificar duplicados contra hseq.sql existente? (s/n): ").lower().strip() in ['s', 'si', 'sí', 'y', 'yes']
        if verificar_duplicados:
            archivo_hseq_existente = input("Ruta del archivo hseq.sql existente (default: hseq.sql): ").strip() or 'hseq.sql'
    
    # Crear instancia del migrador
    migrador = MigracionHSEQ()
    
    # Ejecutar migración
    if migrador.migrar_usuarios(archivo_excel, archivo_sql_salida, unir_con_existente, archivo_hseq_existente):
        print("\n✅ Migración completada exitosamente")
        print(f"📁 Archivo SQL generado: {archivo_sql_salida}")
        print("💡 El archivo usa INSERT IGNORE para evitar duplicados automáticamente")
    else:
        print("\n❌ La migración falló. Revisa el log para más detalles")

if __name__ == "__main__":
    main()
