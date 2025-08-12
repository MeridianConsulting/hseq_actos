import React, { useState } from 'react';
import SuccessAnimation from './SuccessAnimation';

// Ejemplo de uso del componente SuccessAnimation
const SuccessAnimationExample = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationConfig, setAnimationConfig] = useState({
    message: "¡Operación completada!",
    showConfetti: true,
    size: "medium",
    duration: 1000,
    fadeOutDuration: 2000
  });

  const handleSuccess = () => {
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  //
  };

  // Ejemplo 1: Animación básica
  const BasicExample = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Ejemplo Básico</h3>
      <button 
        onClick={handleSuccess}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
      >
        Mostrar Animación Básica
      </button>
      
      <SuccessAnimation
        isVisible={showAnimation}
        onComplete={handleAnimationComplete}
      />
    </div>
  );

  // Ejemplo 2: Animación personalizada grande
  const CustomLargeExample = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Animación Grande</h3>
      <button 
        onClick={() => {
          setAnimationConfig({
            message: "¡Datos guardados correctamente!",
            showConfetti: true,
            size: "large",
            duration: 1500,
            fadeOutDuration: 3000
          });
          setShowAnimation(true);
        }}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
      >
        Animación Grande
      </button>
      
      <SuccessAnimation
        isVisible={showAnimation}
        onComplete={handleAnimationComplete}
        message={animationConfig.message}
        showConfetti={animationConfig.showConfetti}
        size={animationConfig.size}
        duration={animationConfig.duration}
        fadeOutDuration={animationConfig.fadeOutDuration}
      />
    </div>
  );

  // Ejemplo 3: Animación sin confeti
  const NoConfettiExample = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Sin Confeti</h3>
      <button 
        onClick={() => {
          setAnimationConfig({
            message: "Proceso finalizado exitosamente",
            showConfetti: false,
            size: "small",
            duration: 800,
            fadeOutDuration: 1500
          });
          setShowAnimation(true);
        }}
        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
      >
        Animación Simple
      </button>
      
      <SuccessAnimation
        isVisible={showAnimation}
        onComplete={handleAnimationComplete}
        message={animationConfig.message}
        showConfetti={animationConfig.showConfetti}
        size={animationConfig.size}
        duration={animationConfig.duration}
        fadeOutDuration={animationConfig.fadeOutDuration}
      />
    </div>
  );

  // Ejemplo 4: Animación rápida
  const QuickExample = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Animación Rápida</h3>
      <button 
        onClick={() => {
          setAnimationConfig({
            message: "¡Listo!",
            showConfetti: true,
            size: "small",
            duration: 600,
            fadeOutDuration: 1000
          });
          setShowAnimation(true);
        }}
        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
      >
        Animación Rápida
      </button>
      
      <SuccessAnimation
        isVisible={showAnimation}
        onComplete={handleAnimationComplete}
        message={animationConfig.message}
        showConfetti={animationConfig.showConfetti}
        size={animationConfig.size}
        duration={animationConfig.duration}
        fadeOutDuration={animationConfig.fadeOutDuration}
      />
    </div>
  );

  // Ejemplo 5: Animación con mensaje largo
  const LongMessageExample = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Mensaje Largo</h3>
      <button 
        onClick={() => {
          setAnimationConfig({
            message: "El reporte ha sido enviado exitosamente y será revisado por el equipo correspondiente",
            showConfetti: true,
            size: "medium",
            duration: 1200,
            fadeOutDuration: 2500
          });
          setShowAnimation(true);
        }}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
      >
        Mensaje Largo
      </button>
      
      <SuccessAnimation
        isVisible={showAnimation}
        onComplete={handleAnimationComplete}
        message={animationConfig.message}
        showConfetti={animationConfig.showConfetti}
        size={animationConfig.size}
        duration={animationConfig.duration}
        fadeOutDuration={animationConfig.fadeOutDuration}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SuccessAnimation Component
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un componente de animación de éxito profesional y reutilizable construido con React y Framer Motion
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <BasicExample />
          <CustomLargeExample />
          <NoConfettiExample />
          <QuickExample />
          <LongMessageExample />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Propiedades del Componente</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Propiedades Requeridas:</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">isVisible</code>
                  <span className="text-gray-600">Boolean que controla la visibilidad de la animación</span>
                </div>
                <div className="flex items-start space-x-3">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">onComplete</code>
                  <span className="text-gray-600">Función que se ejecuta cuando la animación termina</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Propiedades Opcionales:</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">message</code>
                  <span className="text-gray-600">Mensaje de éxito (default: "¡Enviado exitosamente!")</span>
                </div>
                <div className="flex items-start space-x-3">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">showConfetti</code>
                  <span className="text-gray-600">Mostrar confeti (default: true)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">size</code>
                  <span className="text-gray-600">Tamaño: "small", "medium", "large" (default: "medium")</span>
                </div>
                <div className="flex items-start space-x-3">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">duration</code>
                  <span className="text-gray-600">Duración de la animación en ms (default: 1000)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">fadeOutDuration</code>
                  <span className="text-gray-600">Duración del fade out en ms (default: 2000)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-900">Mejoras Implementadas:</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Diseño más espacioso y profesional con bordes redondeados</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Gradiente en el icono de check para mayor elegancia</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Elementos decorativos sutiles para mayor dinamismo</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Mejor tipografía con título "¡Éxito!" y mensaje descriptivo</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Fondo con mayor opacidad y blur para mejor contraste</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimationExample; 