import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OwnersService } from 'src/owners/owners.service';
import { Repository } from 'typeorm';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';
import { Pet } from './entities/pet.entity';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet) private petRepository: Repository<Pet>,
    @Inject(forwardRef(() => OwnersService))
    private ownersService: OwnersService,
  ) {}

  create(createPetInput: CreatePetInput) {
    const pet = this.petRepository.create(createPetInput);
    return this.petRepository.save(pet);
  }

  async findAll(): Promise<Pet[]> {
    return this.petRepository.find();
  }

  async findOne(id: number) {
    return await this.petRepository.findOneByOrFail({ id });
  }

  async getOwner(id: number) {
    return await this.ownersService.findOne(id);
  }

  async update(id: number, updatePetInput: UpdatePetInput) {
    const pet = await this.petRepository.findOne({
      where: { id },
    });

    return this.petRepository.save({
      ...pet,
      ...updatePetInput,
    });
  }

  async remove(id: number) {
    const pet = await this.petRepository.findOneBy({ id });
    this.petRepository.delete(id);
    return pet;
  }
}
