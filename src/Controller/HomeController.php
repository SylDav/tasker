<?php

namespace App\Controller;

use App\Entity\Task;
use App\Form\TaskType;
use App\Repository\TaskRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("")
 */
class HomeController extends AbstractController
{

    /**
     * @Route("", name="index", methods={"GET", "POST"})
     */
    public function index(): Response
    {

        return $this->render('index.html.twig');
    }
}
