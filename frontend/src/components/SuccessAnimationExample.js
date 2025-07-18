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
    console.log('Animación completada');
  };

  // Ejemplo 1: Animación básica
  const BasicExample = () => (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Ejemplo Básico</h3>
      <button 
        onClick={handleSuccess}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Mostrar Animación Básica
      </button>
      
      <SuccessAnimation
        isVisible={showAnimation}
        onComplete={handleAnimationComplete}
      />
    </div>
  );

  // Ejemplo 2: Animación personalizada
  const CustomExample = () => (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Ejemplo Personalizado</h3>
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
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Animación Personalizada
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
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Sin Confeti</h3>
      <button 
        onClick={() => {
          setAnimationConfig({
            message: "Proceso finalizado",
            showConfetti: false,
            size: "small",
            duration: 800,
            fadeOutDuration: 1500
          });
          setShowAnimation(true);
        }}
        className="bg-gray-500 text-white px-4 py-2 rounded"
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

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Ejemplos de SuccessAnimation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BasicExample />
        <CustomExample />
        <NoConfettiExample />
      </div>

      <div className="mt-8 p-6 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Propiedades del Componente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold">Propiedades Requeridas:</h3>
            <ul className="list-disc list-inside ml-4">
              <li><code>isVisible</code> - Boolean que controla la visibilidad</li>
              <li><code>onComplete</code> - Función que se ejecuta al completar</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Propiedades Opcionales:</h3>
            <ul className="list-disc list-inside ml-4">
              <li><code>message</code> - Mensaje de éxito (default: "¡Enviado exitosamente!")</li>
              <li><code>showConfetti</code> - Mostrar confeti (default: true)</li>
              <li><code>size</code> - Tamaño: "small", "medium", "large" (default: "medium")</li>
              <li><code>duration</code> - Duración de la animación en ms (default: 1000)</li>
              <li><code>fadeOutDuration</code> - Duración del fade out en ms (default: 2000)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimationExample; 