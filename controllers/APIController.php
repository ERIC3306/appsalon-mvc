<?php
//Modelo de servicio y exportacion a .JSON, para su lectura en otros lengujes de programcion como JAVA
//Este modelo no requiere del ROUTER porque las APIs estan separadas del Frontend y nos retorna respuestas .json 

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;

class APIController {
    public static function index() {
        $servicios = Servicio::all();
        echo json_encode($servicios);
    }

    public static function guardar() {
        // Almacena la Cita y devuelve el ID
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();
        //echo json_encode($resultado);

        $id = $resultado['id'];
        // Almacena los Servicios con el ID de la Cita
        $idServicios = explode(",", $_POST['servicios']);       //explode en php = split en js - Separador de cadena
        foreach($idServicios as $idServicio) {                  //Guarda cada uno de los servicios con la referencia de la cita 
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }
        echo json_encode(['resultado' => $resultado]);
    }

    public static function eliminar() {       
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $cita = Cita::find($id);
            $cita->eliminar();
            header('Location:' . $_SERVER['HTTP_REFERER']);     //nos redericciona al servidor principal de nuestra pagina(localhost:3000)
        }
    }
}