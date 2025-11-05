const { Ticket, User } = require('../models');

// creer un ticket
const createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const userId = req.user.id;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Le titre et la description sont requis.',
      });
    }

    if (title.length < 3 || title.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Le titre doit contenir entre 3 et 200 caractères.',
      });
    }

    if (description.length < 10 || description.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'La description doit contenir entre 10 et 5000 caractères.',
      });
    }

    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Priorité invalide. Valeurs acceptées: low, medium, high, urgent.',
      });
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || 'medium',
      userId,
    });

    return res.status(201).json({
      success: true,
      message: 'Ticket créé avec succès.',
      data: { ticket },
    });
  } catch (error) {
    console.error('Erreur lors de la création du ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du ticket.',
    });
  }
};

// get tous les tickets
const getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    // admin voit tous les tickets
    if (req.user.role === 'admin') {
      const tickets = await Ticket.findAll({
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        }],
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json({
        success: true,
        data: { tickets },
      });
    }

    const tickets = await Ticket.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data: { tickets },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tickets:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des tickets.',
    });
  }
};

// get ticket par id
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const ticket = await Ticket.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      }],
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé.',
      });
    }

    if (!isAdmin && ticket.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Accès interdit. Ce ticket ne vous appartient pas.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { ticket },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du ticket.',
    });
  }
};

// update ticket
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé.',
      });
    }

    if (!isAdmin && ticket.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Accès interdit. Ce ticket ne vous appartient pas.',
      });
    }

    // user peut modifier que certains champs, admin peut tout
    const updatedFields = {};
    
    if (title !== undefined) {
      if (title.length < 3 || title.length > 200) {
        return res.status(400).json({
          success: false,
          message: 'Le titre doit contenir entre 3 et 200 caractères.',
        });
      }
      updatedFields.title = title;
    }

    if (description !== undefined) {
      if (description.length < 10 || description.length > 5000) {
        return res.status(400).json({
          success: false,
          message: 'La description doit contenir entre 10 et 5000 caractères.',
        });
      }
      updatedFields.description = description;
    }

    if (priority !== undefined) {
      const validPriorities = ['low', 'medium', 'high', 'urgent'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: 'Priorité invalide.',
        });
      }
      updatedFields.priority = priority;
    }

    if (status !== undefined) {
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Seul un administrateur peut modifier le statut d\'un ticket.',
        });
      }
      const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide.',
        });
      }
      updatedFields.status = status;
    }

    await ticket.update(updatedFields);

    return res.status(200).json({
      success: true,
      message: 'Ticket mis à jour avec succès.',
      data: { ticket },
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du ticket.',
    });
  }
};

// supprimer ticket
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé.',
      });
    }

    if (!isAdmin && ticket.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Accès interdit. Ce ticket ne vous appartient pas.',
      });
    }

    await ticket.destroy();

    return res.status(200).json({
      success: true,
      message: 'Ticket supprimé avec succès.',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du ticket.',
    });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};
