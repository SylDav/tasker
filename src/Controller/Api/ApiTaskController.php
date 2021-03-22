<?php
// api/src/Controller/Api/ApiTaskController.php

namespace App\Controller\Api;

use App\Entity\Task;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;

class ApiTaskController
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function __invoke()
    {
        // On récupère la date d'aujourd'hui et l'on set l'heure à 00:00:00
        $today = new \DateTime();
        $today->setTime(0, 0);
        // On retourne toutes les tâches d'aujourd'hui
        return $this->em->getRepository(Task::class)->findBy([
            'date' => $today
        ]);
    }
}