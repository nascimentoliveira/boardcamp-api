export async function rentalFinalizedValidation(req, res, next) {

  const { returnDate } = res.locals.rental;

  if (!returnDate) {
    res.status(400).send({ message: 'Este aluguel não foi finalizado!' });
    return;
  }

  next();
}