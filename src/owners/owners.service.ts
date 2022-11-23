import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetsService } from 'src/pets/pets.service';
import { Repository } from 'typeorm';
import { CreateOwnerInput } from './dto/create-owner.input';
import { UpdateOwnerInput } from './dto/update-owner.input';
import { Owner } from './entities/owner.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner) private ownerRepository: Repository<Owner>,
    @Inject(forwardRef(() => PetsService))
    private petsService: PetsService,
  ) {}

  async create(createOwnerInput: CreateOwnerInput) {
    const owner = this.ownerRepository.create(createOwnerInput);
    return await this.ownerRepository.save(owner);
  }

  async findAll() {
    return await this.ownerRepository.find();
  }

  findOneUserByUsername(username: string) {
    return this.ownerRepository.findOne({ where: { username } });
  }

  findOne(id: number) {
    return this.ownerRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateOwnerInput: UpdateOwnerInput) {
    const owner = await this.ownerRepository.findOne({
      where: { id },
    });
    if (updateOwnerInput.password) {
      const passCheck = await bcrypt.compare(
        updateOwnerInput.oldPassword,
        owner.password,
      );

      if (passCheck) {
        const { oldPassword, ...result } = updateOwnerInput;
        const password = await bcrypt.hash(updateOwnerInput.password, 10);
        result.password = password;
        console.log(owner, result);

        const updatedUser = await this.ownerRepository.save({
          ...owner,
          ...result,
        });
        delete updatedUser.password;
        return updatedUser;
      } else {
        throw new HttpException('old pass not valid', HttpStatus.BAD_REQUEST);
      }
    } else {
      const updatedUser = await this.ownerRepository.save({
        ...owner,
        ...updateOwnerInput,
      });
      delete updatedUser.password;
      return updatedUser;
    }
  }

  remove(id: number) {
    return this.ownerRepository.delete(id);
  }
}
